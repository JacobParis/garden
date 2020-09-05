import * as React from 'react'

import Menu from '../components/Menu'

import useBreakpoint from '../hooks/useBreakpoint'
import noteModules from '../notes'

const notes = Object.values(noteModules)
import { useParams } from 'react-router-dom'

export default function HomeScene() {
  const [isClosed, setClosed] = React.useState(true)
  const isStatic = useBreakpoint('sm')
  
  const { slug } = useParams()

  const {
    default: Note,
    metadata: {
      title
    }
  } = notes.find(({metadata}) => metadata.slug === slug) || {}
  
  return (
    <Menu
      isStatic={isStatic}
      isClosed={isClosed}
      setClosed={setClosed}
      headerChildren={
        <div className="flex items-center justify-between flex-grow px-3">
          <h1 className="text-lg">{ title }</h1>
        </div>
      }
      sidebarChildren={
        <div className="relative flex-grow py-4 border-r">
          <nav>
            <ul>
              { notes.map(({ metadata }) => (
                <li className="p-3">
                  <a href={`/notes/${metadata.slug}`}> { metadata.title } </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      }
    >
      { Note && (
          <div class="p-4 max-w-6xl mx-auto">
            <article class="prose">
                <Note />
            </article>
          </div>
        )
      }
    </Menu>
  )
}
