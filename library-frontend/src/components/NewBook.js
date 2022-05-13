import { useMutation } from '@apollo/client';
import { useState } from 'react';
import { updateCache } from '../App';
// import { updateCache } from '../App';
import { ADD_BOOK, ALL_AUTHORS, BOOK_DETAILS } from '../service/queries';
import Notification from './Notification';


const NewBook = (props) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([]);
  const [notification, setNotification] = useState(null);
  const [duration, setDuration] = useState(null);

  const [createBook] = useMutation(
    ADD_BOOK,
    {
      refetchQueries: [{query: ALL_AUTHORS}],
      onError: (error) => {
        console.log(error)
      },
      update: (cache, response) => {
        updateCache(cache, { query: BOOK_DETAILS }, response.data.addBook)
      },
    }
  );

  const submit = async (event) => {
    event.preventDefault()

    console.log('add book...')
    // console.log({title, author, published: Number(published), genres});
    let timeout;
    if (title === '' || author === '' || published === '' || genres.length < 1) {
      clearNotification();
      setNotification('Please complete the form before submiting');
      setDuration(3000);
      timeout = setTimeout(() => {
        setNotification( null );
      }, duration);
    }
    function clearNotification() {
      clearTimeout(timeout);
    }

    createBook({variables: {title, author, published: Number(published), genres}});

    setTitle('')
    setPublished('')
    setAuthor('')
    setGenres([])
    setGenre('')
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div>
      <Notification message={notification}/>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(' ')}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  )
}

export default NewBook
