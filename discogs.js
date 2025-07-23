export const fetchDiscogsCollection = async () => {
  const username = 'grubanoah';
  const token = 'AkLGdCCPJKGYNODfFFMhfUYjBBetgGmgUxvZRupx';
  let allReleases = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const res = await fetch(`https://api.discogs.com/users/${username}/collection/folders/0/releases?page=${page}&per_page=100`, {
      headers: {
        'Authorization': `Discogs token=${token}`
      }
    });

    const json = await res.json();

    const releases = json.releases.map(entry => ({
      id: entry.id,
      artist: entry.basic_information.artists[0].name,
      album: entry.basic_information.title,
      year: entry.basic_information.year,
      genre: entry.basic_information.genres[0] || "Unknown",
      cover_image: entry.basic_information.cover_image
    }));

    allReleases = [...allReleases, ...releases];
    page++;
    hasMore = json.pagination && page <= json.pagination.pages;
  }

  return allReleases;
};