// Synchronizing Side-Effects
// http://localhost:3000/isolated/exercise/02.tsx

import * as React from 'react'

type useLocalStorageOptions<TState> = {
  serialize?: (state: TState) => string
  deserialize?: (str: string) => TState
}

function useLocalStorageState<TState>(
  key: string,
  defaultValue: TState | (() => TState),
  {
    serialize = JSON.stringify,
    deserialize = JSON.parse,
  }: useLocalStorageOptions<TState> = {},
) {
  const [state, setState] = React.useState(() => {
    const valueFromLS = window.localStorage.getItem(key)
    if (valueFromLS) {
      try {
        return deserialize(valueFromLS)
      } catch (error) {
        window.localStorage.removeItem(key)
      }
    }
    return defaultValue instanceof Function ? defaultValue() : defaultValue
  })

  const prevKeyRef = React.useRef(key)

  React.useEffect(() => {
    const prevKey = prevKeyRef.current
    if (prevKey !== key) {
      window.localStorage.removeItem(prevKey)
      prevKeyRef.current = key
    }
    window.localStorage.setItem(key, serialize(state))
  }, [key, serialize, state])

  return [state, setState] as const
}

function UsernameForm({
  initialUsername = '',
  onSubmitUsername,
}: {
  initialUsername?: string
  onSubmitUsername: (username: string) => void
}) {
  const [key, setKey] = React.useState('username')
  const [username, setUsername] = useLocalStorageState(key, initialUsername)

  const [touched, setTouched] = React.useState(false)

  const usernameIsLowerCase = username === username.toLowerCase()
  const usernameIsLongEnough = username.length >= 3
  const usernameIsShortEnough = username.length <= 10
  const formIsValid =
    usernameIsShortEnough && usernameIsLongEnough && usernameIsLowerCase

  const displayErrorMessage = touched && !formIsValid

  let errorMessage = null
  if (!usernameIsLowerCase) {
    errorMessage = 'Username must be lower case'
  } else if (!usernameIsLongEnough) {
    errorMessage = 'Username must be at least 3 characters long'
  } else if (!usernameIsShortEnough) {
    errorMessage = 'Username must be no longer than 10 characters'
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setTouched(true)
    if (!formIsValid) return

    onSubmitUsername(username)
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.currentTarget.value
    setUsername(value)
  }

  function handleBlur() {
    setTouched(true)
  }

  return (
    <form name="usernameForm" onSubmit={handleSubmit} noValidate>
      <button
        type="button"
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
          if (key === 'username') setKey('name')
          if (key === 'name') setKey('alias')
          if (key === 'alias') setKey('username')
        }}
      >
        Change key
      </button>
      <div>
        <label htmlFor="usernameInput">Username:</label>
        <input
          id="usernameInput"
          type="text"
          value={username}
          onChange={handleChange}
          onBlur={handleBlur}
          pattern="[a-z]{3,10}"
          required
          aria-describedby={displayErrorMessage ? 'error-message' : undefined}
        />
      </div>
      {displayErrorMessage ? (
        <div role="alert" id="error-message">
          {errorMessage}
        </div>
      ) : null}
      <button type="submit">Submit</button>
    </form>
  )
}

function App() {
  const onSubmitUsername = (username: string) =>
    alert(`You entered: ${username}`)
  return (
    <div style={{width: 400}}>
      <UsernameForm onSubmitUsername={onSubmitUsername} />
    </div>
  )
}

export {App}
