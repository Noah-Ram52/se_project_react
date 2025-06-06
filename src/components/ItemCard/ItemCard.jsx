import "./ItemCard.css";

function ItemCard({ item }) {
  return (
    <div className="card">
      <h2 className="weather__cards-text">{item.name}</h2>
      <img src={item.link} alt={item.name} className="weather__images" />
    </div>
  );
}

export default ItemCard;
