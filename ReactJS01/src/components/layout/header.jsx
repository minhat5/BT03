import { useContext, useState } from 'react';
import { UsergroupAddOutlined, HomeOutlined, SettingOutlined, ShoppingOutlined, SearchOutlined } from '@ant-design/icons';
import { Menu, Input, Button } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/auth.context';

const Header = () => {
    const navigate = useNavigate();
    const { auth, setAuth } = useContext(AuthContext);
    const [current, setCurrent] = useState('home');
    const [searchValue, setSearchValue] = useState('');

    const onClick = (e) => {
        setCurrent(e.key);
    };

    const handleLogout = () => {
        localStorage.clear("access_token");
        setCurrent("home");
        setAuth({
            isAuthenticated: false,
            user: { email: "", name: "" }
        });
        navigate("/");
    };

    const handleSearch = () => {
        if (searchValue.trim()) {
            navigate(`/search?search=${encodeURIComponent(searchValue)}`);
            setSearchValue('');
        }
    };

    const items = [
        {
            label: <Link to={"/"}>Trang chủ</Link>,
            key: 'home',
            icon: <HomeOutlined />,
        },
        {
            label: <Link to={"/search"}>Cửa hàng</Link>,
            key: 'shop',
            icon: <ShoppingOutlined />,
        },
        ...(auth.isAuthenticated ? [{
            label: <Link to={"/user"}>Quản lý</Link>,
            key: 'user',
            icon: <UsergroupAddOutlined />,
        }] : []),
        {
            label: `${auth?.user?.email || "Tài khoản"}`,
            key: 'SubMenu',
            icon: <SettingOutlined />,
            children: [
                ...(auth.isAuthenticated ? [{
                    label: <span onClick={handleLogout}>Đăng xuất</span>,
                    key: 'logout',
                }] : [
                    {
                        label: <Link to={"/login"}>Đăng nhập</Link>,
                        key: 'login',
                    }
                ]),
            ],
        },
    ];

    return (
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
            <div className="container mx-auto px-4 py-3 flex flex-col gap-3 md:flex-row md:items-center md:gap-6">
                <Link to="/" className="text-2xl font-bold text-blue-600 tracking-tight">
                    🛍️ TechShop
                </Link>
                <div className="flex flex-1 items-center gap-2 md:max-w-2xl">
                    <Input
                        placeholder="Tìm kiếm sản phẩm..."
                        prefix={<SearchOutlined />}
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        onPressEnter={handleSearch}
                        className="h-10"
                    />
                    <Button type="primary" onClick={handleSearch} className="h-10 px-5 font-medium">
                        Tìm kiếm
                    </Button>
                </div>
            </div>
            <div className="border-t border-gray-100">
                <Menu
                    onClick={onClick}
                    selectedKeys={[current]}
                    mode="horizontal"
                    items={items}
                    className="container mx-auto px-2"
                />
            </div>
        </header>
    );
};

export default Header;