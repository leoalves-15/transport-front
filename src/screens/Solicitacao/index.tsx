import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Descriptions, Spin, Image, Tag, message } from "antd";
import axios from "axios";
import statusMap from "../../common/formatterStatus";

interface Solicitation {
  tpt_id: number;
  tpt_status: string;
  tpt_recidence: string;
  tpt_rg_front: string;
  tpt_rg_back: string;
  tpt_register_university: string;
  tpt_data: string;
  tpt_university_name: string;
}


const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const SolicitationDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<Solicitation | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get<Solicitation>(
          `http://localhost:3000/solicitation/${id}`
        );
        setData(response.data);
      } catch (error) {
        message.error("Erro ao buscar detalhes da solicitação");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <Spin size="large" />;

  if (!data) return <p>Solicitação não encontrada</p>;

  const status = statusMap[data.tpt_status] || { label: data.tpt_status, color: "default" };

  return (
    <Card title={`Detalhes da Solicitação #${data.tpt_id}`} bordered>
      <Descriptions bordered column={1} size="middle">
        <Descriptions.Item label="Data">
          {formatDate(data.tpt_data)}
        </Descriptions.Item>
        <Descriptions.Item label="Universidade">
          {data.tpt_university_name}
        </Descriptions.Item>
        <Descriptions.Item label="Status">
          <Tag color={status.color}>{status.label}</Tag>
        </Descriptions.Item>
      </Descriptions>

      <div style={{ marginTop: 24, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 16 }}>
        <Card title="Comprovante de Residência">
          <Image src={data.tpt_recidence} alt="Comprovante de Residência" />
        </Card>
        <Card title="RG (Frente)">
          <Image src={data.tpt_rg_front} alt="RG Frente" />
        </Card>
        <Card title="RG (Verso)">
          <Image src={data.tpt_rg_back} alt="RG Verso" />
        </Card>
        <Card title="Comprovante de Matrícula">
          <Image src={data.tpt_register_university} alt="Matrícula" />
        </Card>
      </div>
    </Card>
  );
};

export default SolicitationDetails;
