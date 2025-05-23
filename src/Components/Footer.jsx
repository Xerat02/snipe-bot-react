function Footer() {
  return (
    <footer className="footer sm:footer-horizontal footer-center bg-base-100 text-base-content p-4 mt-2">
      <aside>
        <p>
          Copyright © {new Date().getFullYear()} - All right reserved by CSBAY
        </p>
      </aside>
    </footer>
  );
}

export default Footer;
