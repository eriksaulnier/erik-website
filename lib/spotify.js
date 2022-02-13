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
  const accessToken = await getAccessToken()
  const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })

  const { item } = await response.json()

  return item
}

export async function getTopTracks(limit = 10, timeRange = null) {
  if (limit < 0 || limit > 50) {
    throw new Error(`Invalid limit: ${limit}. Must be between 0 and 50`)
  }

  if (!timeRange) {
    timeRange = timeRanges[2]
  } else if (!timeRanges.includes(timeRange)) {
    throw new Error(`Invalid time range: ${timeRange}. Must be one of ${timeRanges.join(', ')}`)
  }

  const queryParams = querystring.stringify({
    limit: limit,
    time_range: timeRange
  })
  
  const accessToken = await getAccessToken()
  const response = await fetch('https://api.spotify.com/v1/me/top/tracks?' + queryParams, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })

  const { items } = await response.json()

  return items
}

export async function getTopArtists(limit = 10, timeRange = null) {
  if (limit < 0 || limit > 50) {
    throw new Error(`Invalid limit: ${limit}. Must be between 0 and 50`)
  }

  if (!timeRange) {
    timeRange = timeRanges[2]
  } else if (!timeRanges.includes(timeRange)) {
    throw new Error(`Invalid time range: ${timeRange}. Must be one of ${timeRanges.join(', ')}`)
  }

  const queryParams = querystring.stringify({
    limit: limit,
    time_range: timeRange
  })
  
  const accessToken = await getAccessToken()
  const response = await fetch('https://api.spotify.com/v1/me/top/artists?' + queryParams, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })

  const { items } = await response.json()

  return items
}