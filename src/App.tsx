import { ConfigProvider, theme } from "antd";
import { Layout, Typography } from "antd";
import TcoCalculator from "./components/TcoCalculatorFull";
import "./App.css";

const { Content } = Layout;
const { Title } = Typography;

function App() {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: "#2196f3",
          colorBgContainer: "#ffffff",
          colorText: "#1a1a1a",
          colorTextSecondary: "#666666",
          borderRadius: 12,
          fontFamily:
            '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        },
        components: {
          Card: {
            boxShadowTertiary:
              "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
          },
          Button: {
            borderRadius: 8,
          },
          Input: {
            borderRadius: 8,
          },
        },
      }}
    >
      <Layout style={{ minHeight: "100vh", backgroundColor: "#ffffff" }}>
        <Content style={{ padding: "8px 4px" }}>
          <div
            style={{
              maxWidth: "1200px",
              margin: "0 auto",
              padding: "0 8px",
              width: "100%",
            }}
          >
            <div style={{ textAlign: "center", marginBottom: "24px" }}>
              <Title
                level={1}
                style={{
                  marginBottom: 8,
                  background:
                    "linear-gradient(135deg, #1a1a1a 0%, #2196f3 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  display: "inline-block",
                  fontSize: "clamp(1.8rem, 5vw, 2.5rem)",
                  fontWeight: 700,
                  letterSpacing: "-0.025em",
                  lineHeight: 1.2,
                }}
              >
                🏍️ Calculateur TCO Moto
              </Title>
              <Title
                level={3}
                type="secondary"
                style={{
                  fontWeight: 400,
                  maxWidth: "600px",
                  margin: "0 auto",
                  fontSize: "clamp(1rem, 3vw, 1.5rem)",
                  lineHeight: 1.4,
                  padding: "0 16px",
                }}
              >
                Calculez le coût total de possession de votre moto en France
              </Title>
            </div>
            <TcoCalculator />
          </div>
        </Content>
      </Layout>
    </ConfigProvider>
  );
}

export default App;
