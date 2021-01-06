import noteModules from '../notes'
import { useQuery } from 'react-query'

export function useNotes() {
  return Object.values(noteModules)
}

export function useNote(slug) {
  const notes = useNotes()

  const { default: Note, ...meta } =
    notes.find((noteModule) => noteModule.slug === slug) || {}

  const url = `https://api.github.com/repos/jacobparis/garden/commits?path=app/notes/${slug}.mdx`

  const { isLoading, error, data } = useQuery(slug, () =>
    fetch(url).then((res) => res.json())
  )

  return {
    isLoading,
    error,
    Note,
    data,
    ...meta,
  }
}
