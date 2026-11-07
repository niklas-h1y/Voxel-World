/* Loads the numbered bundle fragments in order, then runs the original classic script. */
(async () => {
  const parts = ["voxel-world-01.js","voxel-world-02.js","voxel-world-03.js","voxel-world-04.js","voxel-world-05.js","voxel-world-06.js","voxel-world-07.js","voxel-world-08.js"];
  const responses = await Promise.all(parts.map(async (file) => {
    const response = await fetch(new URL(file, import.meta.url));
    if (!response.ok) throw new Error(`Could not load ${file}: HTTP ${response.status}`);
    return response.text();
  }));
  new Function(responses.join(""))();
})().catch((error) => console.error("Voxel World failed to load:", error));
