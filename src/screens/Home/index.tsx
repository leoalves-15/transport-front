import React, { useEffect, useState } from 'react';
import { Table, Spin, message } from 'antd';
import axios from 'axios';

interface DataType {
    key: string;
    name: string;
    age: number;
    address: string;
}

const columns = [
    {
        title: 'Nome',
        dataIndex: 'user_usr_name',
        key: 'user_usr_name',
    },
    {
        title: 'Data',
        dataIndex: 'solicitation_tpt_data',
        key: 'solicitation_tpt_data',
    },
    {
        title: 'Universidade',
        dataIndex: 'solicitation_tpt_university_name',
        key: 'solicitation_tpt_university_name',
    },
    {
        title: 'Estado',
        dataIndex: 'solicitation_tpt_status',
        key: 'solicitation_tpt_status',
    },
];

const Home: React.FC = () => {
    const [data, setData] = useState<DataType[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get<DataType[]>('http://localhost:3000/solicitation');
                setData(response.data.map((item, idx) => ({ ...item, key: String(idx) })));
            } catch (error) {
                message.error('Failed to fetch data');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div>
            <h1>Home</h1>
            {loading ? <Spin /> : <Table columns={columns} dataSource={data} />}
        </div>
    );
};

export default Home;