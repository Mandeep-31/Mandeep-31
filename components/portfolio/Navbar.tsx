import Link from "next/link";

export default function Navbar() {
  return (
    <header className="nav">
      <nav className="nav-group nav-left" aria-label="Primary">
        <Link href="/#work">Work</Link>
        <Link href="/about">About</Link>
      </nav>

      <Link className="nav-brand" href="/" aria-label="Mandeep — home">
        Mandeep
      </Link>

      <nav className="nav-group nav-right" aria-label="Secondary">
        <a href="mailto:mandeepac31@gmail.com">Contact</a>
      </nav>
    </header>
  );
}