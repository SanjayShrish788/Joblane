const value=process.env.REACT_APP_API_BASE_URL;
if (!value) throw new Error('Set REACT_APP_API_BASE_URL before building');
const url=new URL(value);
if (url.protocol!=='https:' || ['localhost','127.0.0.1','[::1]'].includes(url.hostname) || url.username || url.password || url.search || url.hash)
  throw new Error('Production API URL must use HTTPS and contain no credentials, query or fragment');
