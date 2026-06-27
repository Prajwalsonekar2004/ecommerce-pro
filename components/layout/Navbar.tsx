export default function Navbar() {
    return (
        <nav className="flex items-center justify-between px-8 py-4 border-b">
            <h1 className="text-2x1 font-bold">Ecommerce Pro</h1>

            <ul className="flex gap-6">
                <li>Home</li>
                <li>Product</li>
                <li>Categories</li>
                <li>Contact</li>
            </ul>
        </nav>
    );
}