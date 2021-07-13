export const flattenFolderStructure = (
  folders: Folder[],
  flattenFolders: Folder[] = []
): Folder[] => {
  flattenFolders = flattenFolders.concat(folders);

  for (const folder of folders) {
    if (folder.children.length === 0) continue;

    flattenFolders = flattenFolderStructure(folder.children, flattenFolders);
  }

  return flattenFolders;
};
