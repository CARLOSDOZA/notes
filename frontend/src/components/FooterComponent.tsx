export default function FooterComponent() {
    return (
      <footer className=" border-t">
        <div className="footer-content">
          <p>&copy; {new Date().getFullYear()} Notes.Go</p>
        </div>
      </footer>
    );
  }