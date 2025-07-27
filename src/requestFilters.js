import https from 'https';

const requestFilters = (url) => {
  return new Promise((resolve) => {
    let content = '';
    let count = 0;

    https.get(url, (res) => {
      const headers = res.headers;
      const contentLength = Number(headers['content-length']);

      res.on('data', (d) => {
        console.log(
          (count += 1),
          ' curennt: ',
          content.length,
          ' total: ',
          contentLength,
          contentLength >= content.length,
        );
        content += d;
      });

      res.on('end', () => {
        resolve(content);
      });

      res.on('error', () => {
        resolve('');
      });
    })
  });
}

export default requestFilters;
