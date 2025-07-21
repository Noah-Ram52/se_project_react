import "./Footer.css";

// new Date().getFullYear();

function Footer() {
  // Shows the current year in the footer
  const currentYear = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="footer__text">Developed by Noah Ramos</div>
      <div className="footer__year">{currentYear}</div>
    </footer>
  );
}
export default Footer;
