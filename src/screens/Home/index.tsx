import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Layout, Menu, theme, Table, Spin, message, Input, DatePicker } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import axios from 'axios';
import dayjs from 'dayjs';
import formatterStatus from '../../common/formatterStatus';

import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;

interface DataType {
    key: string;
    solicitation_tpt_id: number;
    user_usr_name: string;
    solicitation_tpt_data: string;
    solicitation_tpt_university_name: string;
    solicitation_tpt_status: string;
}

const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
};

const Status: React.FC<{ status: string }> = ({ status }) => {
    const statusInfo = formatterStatus[status] || { label: status, color: 'default' };
    return <span style={{ color: statusInfo.color, borderColor: statusInfo.color, borderWidth: '1px', borderStyle: 'solid', padding: '4px 8px', borderRadius: '8px' }}>{statusInfo.label}</span>;
}

const Home: React.FC = () => {
    const [data, setData] = useState<DataType[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const columns: ColumnsType<DataType> = [
        {
            title: 'Nome',
            dataIndex: 'user_usr_name',
            key: 'user_usr_name',
            sorter: (a, b) => a.user_usr_name.localeCompare(b.user_usr_name),
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div style={{ padding: 8 }}>
                    <Input
                        placeholder="Buscar Nome"
                        value={selectedKeys[0] ? String(selectedKeys[0]) : ''}
                        onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={() => confirm()}
                        style={{ marginBottom: 8, display: 'block' }}
                    />
                    <Button onClick={() => confirm()} type="primary">
                        Buscar
                    </Button>
                    <Button onClick={() => clearFilters && clearFilters()} style={{ marginLeft: 8 }}>
                        Resetar
                    </Button>
                </div>
            ),
            onFilter: (value, record) =>
                record.user_usr_name.toLowerCase().includes(String(value).toLowerCase()),
        },
        {
            title: 'Data',
            dataIndex: 'solicitation_tpt_data',
            key: 'solicitation_tpt_data',
            render: (date: string) => formatDate(date),
            sorter: (a, b) =>
                new Date(a.solicitation_tpt_data).getTime() -
                new Date(b.solicitation_tpt_data).getTime(),
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div style={{ padding: 8 }}>
                    <DatePicker
                        value={selectedKeys[0] ? dayjs(String(selectedKeys[0])) : null}
                        onChange={(date) => {
                            setSelectedKeys(date ? [date.format('YYYY-MM-DD')] : []);
                        }}
                        style={{ marginBottom: 8, display: 'block' }}
                    />
                    <Button onClick={() => confirm()} type="primary">
                        Filtrar
                    </Button>
                    <Button onClick={() => clearFilters && clearFilters()} style={{ marginLeft: 8 }}>
                        Resetar
                    </Button>
                </div>
            ),
            onFilter: (value, record) =>
                dayjs(record.solicitation_tpt_data).format('YYYY-MM-DD') === value,
        },
        {
            title: 'Universidade',
            dataIndex: 'solicitation_tpt_university_name',
            key: 'solicitation_tpt_university_name',
        },
        {
            title: 'Status',
            dataIndex: 'solicitation_tpt_status',
            key: 'solicitation_tpt_status',
            render: (status: string) => <Status status={status} />,
            filters: [
                { text: 'Pendente', value: 'P' },
                { text: 'Aprovado', value: 'A' },
                { text: 'Rejeitado', value: 'R' },
            ],
            onFilter: (value, record) => record.solicitation_tpt_status === value,
        },
        {
            title: 'Ação',
            dataIndex: 'solicitation_tpt_id',
            key: 'action',
            render: (id: number) => (
                <Button variant='solid' style={{borderWidth:'0px'}} onClick={() => navigate(`/solicitacao/${id}`)}>Ver detalhes</Button>
            ),
        },
    ];

    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get<DataType[]>('http://localhost:3000/solicitation');
                setData(response.data.map((item, idx) => ({ ...item, key: String(idx) })));
            } catch (error) {
                message.error('Falha ao buscar dados');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <Layout style={{ minHeight: '100vh', minWidth: '100vw' }}>
            <Layout>
                <Layout>
                    <Header style={{ padding: 0, background: colorBgContainer }}>
                        <Button
                            type="text"
                            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                            onClick={() => setCollapsed(!collapsed)}
                            style={{
                                fontSize: '16px',
                                width: 64,
                                height: 64,
                            }}
                        />
                    </Header>
                    <Layout>
                        <Sider trigger={null} collapsible collapsed={collapsed}>
                            <div className="demo-logo-vertical" />
                            <Menu
                                theme="dark"
                                mode="inline"
                                defaultSelectedKeys={['1']}
                                items={[
                                    { key: '1', icon: <UserOutlined />, label: 'nav 1' },
                                    { key: '2', icon: <VideoCameraOutlined />, label: 'nav 2' },
                                    { key: '3', icon: <UploadOutlined />, label: 'nav 3' },
                                ]}
                            />
                        </Sider>
                        <Content
                            style={{
                                margin: '24px 16px',
                                padding: 24,
                                minHeight: 280,
                                background: colorBgContainer,
                                borderRadius: borderRadiusLG,
                            }}
                        >
                            <div>
                                {loading ? <Spin /> : <Table columns={columns} dataSource={data} />}
                            </div>
                        </Content>
                    </Layout>
                </Layout>
            </Layout>
        </Layout>
    );
};

export default Home;
