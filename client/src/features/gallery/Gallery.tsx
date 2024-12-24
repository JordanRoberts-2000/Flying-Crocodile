import Masonry from "@mui/lab/Masonry";
const images = import.meta.glob("../../assets/images/*", { eager: true });

const Gallery = () => {
  const imageUrls = Object.values(images).map((module: any) => module.default);

  return (
    <Masonry columns={{ xs: 2, lg: 4 }} spacing={2}>
      {imageUrls.map((src, index) => (
        <img
          key={index}
          src={src}
          alt={`Gallery Image ${index + 1}`}
          className="rounded shadow"
        />
      ))}
    </Masonry>
  );
};

export default Gallery;
