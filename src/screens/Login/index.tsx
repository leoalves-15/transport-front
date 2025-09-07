import { Form, Input, Button, Checkbox, message } from 'antd';
import type { FormProps } from 'antd';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // vamos criar um CSS dedicado

type FieldType = {
  usr_id: string;
  usr_password: string;
  remember?: boolean;
};

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    try {
      const res = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usr_id: values.usr_id,
          usr_password: values.usr_password,
        }),
      });

      if (!res.ok) throw new Error('Usuário ou senha inválidos');

      const data = await res.json();
      login(data.access_token);
      message.success('Login realizado com sucesso!');
      navigate('/');
    } catch (err: any) {
      message.error(err.message || 'Erro ao logar');
    }
  };

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className="login-container">
      <Form<FieldType>
        name="login"
        className="login-form"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >

        <img src="https://conceicaodocoite.ba.gov.br/wp-content/uploads/2025/05/logo-prefeitura.png" alt="" />

        <h2 className="login-title">Bem-vindo</h2>

        <Form.Item<FieldType>
          name="usr_id"
          rules={[{ required: true, message: 'Por favor digite seu usuário!' }]}
        >
          <Input placeholder="Usuário" className="login-input" />
        </Form.Item>

        <Form.Item<FieldType>
          name="usr_password"
          rules={[{ required: true, message: 'Por favor digite sua senha!' }]}
        >
          <Input.Password placeholder="Senha" className="login-input" />
        </Form.Item>

        <Form.Item<FieldType> name="remember" valuePropName="checked">
          <Checkbox>Lembrar-me</Checkbox>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="login-button">
            Entrar
          </Button>
          <Button type="default" onClick={() => navigate('/register')} className="login-button register-button">
            Cadastrar
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
