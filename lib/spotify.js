import querystring from 'querystring'

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN;

const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')

const timeRanges = ['short_term', 'medium_term', 'long_term']

export async function getAccessToken() {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: querystring.stringify({
      grant_type: 'refresh_token',
      refresh_token: REFRESH_TOKEN
    })
  })

  const { access_token } = await response.json()

  return access_token
}

export async function getCurrentlyPlaying() {
  try {
    const accessToken = await getAccessToken()
    const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
  
    const { item } = await response.json()

    const { name, artists, album, external_urls } = item
    return {
      name: name,
      artist: artists.map(artist => artist.name).join(', '),
      album: album.name,
      artwork: album.images[0].url,
      link: external_urls.spotify
    }
  } catch (error) {
    console.error(error)
  }
}

export async function getTopTracks(limit = 10, timeRange = null) {
  if (limit < 0 || limit > 50) {
    throw new Error(`Invalid limit: ${limit}. Must be between 0 and 50`)
  }

  if (!timeRange) {
    timeRange = timeRanges[2]
  } else if (!timeRanges.includes(timeRange)) {
    const message = `Invalid time range: ${timeRange}. Must be one of: ${timeRanges.join(', ')}`
    throw new Error(message)
  }

  const queryParams = querystring.stringify({
    limit: limit,
    time_range: timeRange
  })
  
  try {
    const accessToken = await getAccessToken()
    const response = await fetch('https://api.spotify.com/v1/me/top/tracks?' + queryParams, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })

    const { items } = await response.json()

    return items.map(track => {
      const { name, artists, album, external_urls } = track
      return {
        name: name,
        artist: artists.map(artist => artist.name).join(', '),
        album: album.name,
        artwork: album.images[0].url,
        link: external_urls.spotify
      }
    })
  } catch (error) {
    console.error(error)
  }
}

export async function getTopArtists(limit = 10, timeRange = null) {
  if (limit < 0 || limit > 50) {
    throw new Error(`Invalid limit: ${limit}. Must be between 0 and 50`)
  }

  if (!timeRange) {
    timeRange = timeRanges[2]
  } else if (!timeRanges.includes(timeRange)) {
    const message = `Invalid time range: ${timeRange}. Must be one of: ${timeRanges.join(', ')}`
    throw new Error(message)
  }

  const queryParams = querystring.stringify({
    limit: limit,
    time_range: timeRange
  })
  
  try {
    const accessToken = await getAccessToken()
    const response = await fetch('https://api.spotify.com/v1/me/top/artists?' + queryParams, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })

    const { items } = await response.json()

    return items.map(artist => {
      const { name, images, external_urls } = artist
      return {
        name: name,
        image: images[0].url,
        link: external_urls.spotify
      }
    })
  } catch (error) {
    console.error(error)
  }
}