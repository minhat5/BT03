import { GithubOutlined, LinkedinOutlined, MailOutlined } from '@ant-design/icons';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-800 text-white py-12 mt-12">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    {/* About */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">🛍️ TechShop</h3>
                        <p className="text-gray-300 text-sm">
                            Cửa hàng bán các sản phẩm công nghệ chất lượng cao với giá tốt nhất trên thị trường.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-bold mb-4">Liên kết nhanh</h3>
                        <ul className="space-y-2 text-gray-300 text-sm">
                            <li><a href="/" className="hover:text-white transition">Trang chủ</a></li>
                            <li><a href="/search" className="hover:text-white transition">Cửa hàng</a></li>
                            <li><a href="#" className="hover:text-white transition">Về chúng tôi</a></li>
                            <li><a href="#" className="hover:text-white transition">Liên hệ</a></li>
                        </ul>
                    </div>

                    {/* Policy */}
                    <div>
                        <h3 className="text-lg font-bold mb-4">Chính sách</h3>
                        <ul className="space-y-2 text-gray-300 text-sm">
                            <li><a href="#" className="hover:text-white transition">Chính sách bảo mật</a></li>
                            <li><a href="#" className="hover:text-white transition">Điều khoản sử dụng</a></li>
                            <li><a href="#" className="hover:text-white transition">Chính sách hoàn trả</a></li>
                            <li><a href="#" className="hover:text-white transition">Hỗ trợ khách hàng</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-lg font-bold mb-4">Liên hệ</h3>
                        <p className="text-gray-300 text-sm mb-4">
                            📞 1800 1234<br />
                            📧 support@techshop.vn<br />
                            📍 123 Đường ABC, Thành phố HCM
                        </p>
                        <div className="flex gap-4 text-xl">
                            <a href="#" className="hover:text-blue-400 transition"><GithubOutlined /></a>
                            <a href="#" className="hover:text-blue-400 transition"><LinkedinOutlined /></a>
                            <a href="#" className="hover:text-blue-400 transition"><MailOutlined /></a>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-700 pt-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center text-gray-400 text-sm">
                        <div>
                            <p>✓ Giao hàng miễn phí</p>
                        </div>
                        <div>
                            <p>✓ Hoàn tiền 100% nếu không hài lòng</p>
                        </div>
                        <div>
                            <p>✓ Hỗ trợ 24/7</p>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 text-sm">
                    <p>© {currentYear} TechShop. All rights reserved.</p>
                    <p className="mt-2">Made with ❤️ using React + Tailwind CSS</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
