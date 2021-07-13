declare module '*.svg' {
  const svgContent: any;
  export default svgContent;
}

declare module '*.png' {
  const svgContent: any;
  export default svgContent;
}

interface Folder {
  id: number;
  name: string;
  children: Folder[];
  order: number;
  parentFolderId: number | null;
}

interface EncodedPhoto {
  id: number;
  name: string;
  data: string;
  order: number;
}

interface Photo {
  id: number;
  name: string;
  order: number;
}
