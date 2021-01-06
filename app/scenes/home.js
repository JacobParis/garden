import * as React from 'react'

import Menu from '../components/Menu'

import useBreakpoint from '../hooks/useBreakpoint'

import { useParams } from 'react-router-dom'
import { useNote, useNotes } from '../hooks/useNotes'

export default function HomeScene() {
  const [isClosed, setClosed] = React.useState(true)
  const isStatic = useBreakpoint('sm')
  const { slug } = useParams()

  const notes = useNotes()
  const { Note, isLoaded, data, title, pathname } = useNote(slug)

  console.log(data)
  return Note ? (
    <Menu
      isStatic={isStatic}
      isClosed={isClosed}
      setClosed={setClosed}
      sidebarChildren={
        <div className="relative flex-grow py-4 border-r">
          <nav>
            <ul>
              {notes.map((noteModule) => (
                <li className="p-3" key={noteModule.slug}>
                  <a
                    className="text-blue-700 underline"
                    href={`/notes/${noteModule.slug}`}
                  >
                    {' '}
                    {noteModule.title}{' '}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="p-3">
            <a
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 underline"
              href="https://github.com/JacobParis/garden/new/master/app/notes"
            >
              Add a new note
            </a>
          </div>
        </div>
      }
    >
      {Note && (
        <div className="max-w-6xl p-4 mx-auto">
          <article>
            <h1 className="mb-3 text-4xl">{title}</h1>

            <div className="prose">
              <Note />
            </div>

            <footer className="py-3">
              {isLoaded && (
                <div>
                  <h2 className="text-lg"> Contributors </h2>

                  <ul>
                    {Object.values(
                      data.reduce((acc, commit) => {
                        acc[commit.author.id] = commit

                        return acc
                      }, {})
                    ).map(({ author }) => (
                      <li key={author.id} className="flex content-center">
                        <a href={author.url}>
                          <img
                            src={author.avatar_url}
                            className="w-8 h-8 rounded-full"
                          />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <a
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 underline"
                href={`https://github.com/jacobparis/garden/blob/master/app/notes/${pathname}`}
              >
                Make your own contribution on GitHub
              </a>
            </footer>
          </article>
        </div>
      )}

      <a
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-700 underline"
        href="https://github.com/JacobParis/garden"
      >
        Source
      </a>
    </Menu>
  ) : (
    <main className="p-10">
      <h1 className="text-6xl font-bold"> Jacob Paris </h1>

      <p className="mb-8 text-xl text-gray-700">
        I build products for the Canadian mortgage sector
      </p>

      <h2> You can find me here </h2>
      <ul className="mb-8">
        <li className="p-3">
          <a
            className="text-blue-700"
            href="https://twitter.com/jacobmparis"
            target="blank"
            referrerPolicy="no-referrer"
          >
            Twitter
          </a>
        </li>
        <li className="p-3">
          <a
            className="text-blue-700"
            href="https://github.com/jacobparis"
            target="blank"
            referrerPolicy="no-referrer"
          >
            GitHub
          </a>
        </li>
        <li className="p-3">
          <a
            className="text-blue-700"
            href="https://instagram.com/jacobmparis"
            target="blank"
            referrerPolicy="no-referrer"
          >
            Instagram
          </a>
        </li>
      </ul>

      <h2> I am currently hiring </h2>
      <ul className="mb-8">
        <p className="p-3"> A designer to make this site look better </p>
      </ul>

      <h2> Titles of articles I&apos;ve written </h2>
      <small className="text-gray-700">
        {' '}
        You can google them and they&apos;ll come up{' '}
      </small>

      <ul className="mb-8">
        <li className="p-3">SLIDING SIDEBAR IN REACT AND TAILWIND CSS</li>
        <li className="p-3">CHARTING A CONTACT FORM IN XSTATE</li>
        <li className="p-3">HOW TO FOR-LOOP THROUGH ANYTHING IN JS</li>
        <li className="p-3">REACT HOOKS: USEEFFECT, USECALLBACK, USEMEMO</li>
        <li className="p-3">HAMBURGER MENU IN PURE CSS</li>
        <li className="p-3">XSTATE TEXT FORMATTING</li>
        <li className="p-3">HOW TO CENTER ANYTHING IN CSS</li>
        <li className="p-3">ASYNC FUNCTION FROM START TO FINISH</li>
        <li className="p-3">AN INCOMPLETE GUIDE TO HTML LAYOUTS</li>
        <li className="p-3">RESPONSIVE TEXT</li>
        <li className="p-3">REACT TUTORIAL</li>
      </ul>
      <h2> My notes </h2>
      <ul className="mb-8">
        {notes
          .filter((noteModule) => !noteModule.private)
          .filter((noteModule) => noteModule.title)
          .map((noteModule) => (
            <li className="p-3" key={noteModule.slug}>
              <a className="text-blue-700" href={`/notes/${noteModule.slug}`}>
                {noteModule.title}
              </a>
            </li>
          ))}
      </ul>

      <footer className="text-center">
        &copy; {new Date().getFullYear()} from Paris with ♥️
      </footer>
    </main>
  )
}
