const template = require('@babel/template').default
const _path = require('path')
const _fs = require('fs')

const wildcardRegex = /\/\*$/
const recursiveRegex = /\/\*\*$/
const buildRequire = template(`for (let key in IMPORTED) {
  DIR_IMPORT[key === 'default' ? IMPORTED_NAME : key] = IMPORTED[key]
}`)

function toCamelCase(input) {
  return input.replace(/([-_.]\w)/g, (_, $1) => $1[1].toUpperCase())
}

function toSnakeCase (input) {
  return input.replace(/([-.A-Z])/g, (_, $1) => '_' + ($1 === '.' || $1 === '-' ? '' : $1.toLowerCase()))
}

function getFiles ({parent, exts = ['.js'], files = [], recursive = false, path = []}) {
  let r = _fs.readdirSync(parent)

  for (let i = 0, l = r.length; i < l; i++) {
    let child = r[i]

    const {name, ext} = _path.parse(child)
    const file = path.concat(name + ext)

    // Check extension is of one of the aboves
    if (exts.includes(ext)) {
      files.push(file)
    } else if (recursive && _fs.statSync(_path.join(parent, child)).isDirectory()) {
      getFiles(_path.join(parent, name), exts, files, recursive, file)
    }
  }

  return files
}

module.exports = function dir (babel) {
  const { types: t } = babel

  return {
    visitor: {
      ImportDeclaration (path, state) {
        const src = path.node.source.value

        // Don't import modules by mistake
        if (!src.startsWith('.') && !src.startsWith('/')) return

        const isExplicitWildcard = wildcardRegex.test(src)
        let cleanedPath = src.replace(wildcardRegex, '')

        const isRecursive = recursiveRegex.test(cleanedPath)
        cleanedPath = cleanedPath.replace(recursiveRegex, '')

        const sourcePath = this.file.opts.parserOpts.sourceFileName || this.file.opts.parserOpts.filename || ''
        const checkPath = _path.resolve(_path.join(_path.dirname(sourcePath), cleanedPath))

        try {
          require.resolve(checkPath)

          return
        } catch (e) {}

        try {
          // Don't import files by mistake
          if (!_fs.statSync(checkPath).isDirectory()) return 
        } catch (e) {
          return
        }

        const nameTransform = state.opts.snakeCase ? toSnakeCase : toCamelCase

        const files = getFiles({
          parent: checkPath,
          exts: state.opts.exts,
          recursive: isRecursive
        }).map((file) => ({
          file: file,
          fileName: nameTransform(file[file.length - 1]),
          fileUid: path.scope.generateUidIdentifier(file[file.length - 1])
        }))

        if (!files.length) return

        const imports = files.map(({file, fileUid}) => {
          return t.importDeclaration(
            [t.importNamespaceSpecifier(fileUid)],
            t.stringLiteral(_path.join(cleanedPath, ...file))
          )
        })

        let dirVar = path.scope.generateUidIdentifier('dirImport')
        path.insertBefore(t.variableDeclaration(
          'const', [
            t.variableDeclarator(dirVar, t.objectExpression([]))
          ]
        ))

        for (const dec of path.node.specifiers) {
          if (t.isImportNamespaceSpecifier(dec) || t.isImportDefaultSpecifier(dec)) {
            path.insertAfter(t.variableDeclaration(
              'const', [
                t.variableDeclarator(
                  t.identifier(dec.local.name),
                  dirVar
                )
              ]
            ))
          }

          if (t.isImportSpecifier(dec)) {
            path.insertAfter(t.variableDeclaration(
              'const', [
                t.variableDeclarator(
                  t.identifier(dec.local.name),
                  t.memberExpression(
                    dirVar,
                    t.identifier(dec.imported.name)
                  )
                )
              ]
            ))
          }
        }

        if (isExplicitWildcard) {
          files.forEach(({file, fileName, fileUid}) =>
            path.insertAfter(buildRequire({
              IMPORTED_NAME: t.stringLiteral(fileName),
              DIR_IMPORT: dirVar,
              IMPORTED: fileUid
            }))
          )
        } else {
          files.forEach(({file, fileName, fileUid}) => {
            const [slug] = file[0].split('.')

            // Add the module
            path.insertBefore(
              t.assignmentExpression(
                '=',
                t.memberExpression(
                  dirVar,
                  t.identifier(fileName)
                ),
                fileUid
              )
            )

            // Add the url slug
            path.insertBefore(
              t.assignmentExpression(
                '=',
                t.memberExpression(
                  t.memberExpression(
                    dirVar,
                    t.identifier(fileName),
                  ),
                  t.identifier('slug'),
                ),
                t.stringLiteral(slug)
              )
            )

            // Add the pathname
            path.insertBefore(
              t.assignmentExpression(
                '=',
                t.memberExpression(
                  t.memberExpression(
                    dirVar,
                    t.identifier(fileName),
                  ),
                  t.identifier('pathname'),
                ),
                t.stringLiteral(file[0])
              )
            )
          }
          )
        }

        path.replaceWithMultiple(imports)
      }
    }
  }
}
