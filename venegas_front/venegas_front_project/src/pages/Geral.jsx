import { useEffect, useState } from "react";
import { BiCameraMovie, BiLogoInternetExplorer, BiSearchAlt2 } from "react-icons/bi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  PieChart,
  Pie,
  Sector,
  LineChart, 
  Line,
   AreaChart, Area,
} from "recharts";



import axios from "axios";

import "./Geral.css";

const Geral = () => {
    const currentDate = new Date();

    // Obtém o mês atual e subtrai 1 para o mês anterior
    const lastMonth = currentDate.getMonth() - 1;
    const year = lastMonth < 0 ? currentDate.getFullYear() - 1 : currentDate.getFullYear();
    const month = lastMonth < 0 ? 11 : lastMonth;
    const firstDayLastMonth = new Date(year, month, 1);

    const day = String(firstDayLastMonth.getDate()).padStart(2, "0");
    const formattedDate = `${day}-${String(firstDayLastMonth.getMonth() + 1).padStart(2, "0")}-${firstDayLastMonth.getFullYear()}`;

    const [data, setData] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [loading, setLoading] = useState(true); // Estado de carregamento


    const [dataPeriodo, setDataPeriodo] = useState([]);

    const pieData = [
        { name: "Contabil", value: data[0]?.custo_contabil_total },
        { name: "Fiscal", value: data[0]?.custo_fiscal_total },
        { name: "Pessoal", value: data[0]?.custo_dp_total },,
    ];


    const analiseAllURL = import.meta.env.VITE_API_ANALISE_SEARCH_ALL

    const analiseDataURL = import.meta.env.VITE_API_ANALISE_SEARCH_DATE

    useEffect(()=>{
      setLoading(true);
      axios
      .get(`${analiseAllURL}`)
      .then((response)=>{
        console.log('Response dataPeriodo:', response.data);
        setDataPeriodo(response.data);
      })
      .catch((error)=>{
        console.log('Error fetching data', error);
      });

    }, []);


    useEffect(() => {
        setLoading(true);
        axios
        .get(`${analiseDataURL}?data=${formattedDate}`)
        .then((response) => {
            console.log("Response Data:", response.data);
            setData(response.data);
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
        });
    }, [formattedDate]);

    const renderActiveShape = (props) => {
        const RADIAN = Math.PI / 180;
        const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
        const sin = Math.sin(-RADIAN * midAngle);
        const cos = Math.cos(-RADIAN * midAngle);
        const sx = cx + (outerRadius + 10) * cos;
        const sy = cy + (outerRadius + 10) * sin;
        const mx = cx + (outerRadius + 30) * cos;
        const my = cy + (outerRadius + 30) * sin;
        const ex = mx + (cos >= 0 ? 1 : -1) * 22;
        const ey = my;
        const textAnchor = cos >= 0 ? "start" : "end";
    return (
      <g>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
          {payload.name}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`PV ${value}`}</text>
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
          {`(Rate ${(percent * 100).toFixed(2)}%)`}
        </text>
      </g>
    );
  };


  
  const toPercent = (decimal, fixed = 0) => `${(decimal * 100).toFixed(fixed)}%`;

  const getPercent = (value, total) => {
    const ratio = total > 0 ? value / total : 0;
  
    return toPercent(ratio, 2);
  };
  
  const renderTooltipContent = (o) => {
    const { payload, label } = o;
    const total = payload.reduce((result, entry) => result + entry.value, 0);
  
    return (
      <div className="customized-tooltip-content">
        <p className="total">{`${label} (Total: ${total})`}</p>
        <ul className="list">
          {payload.map((entry, index) => (
            <li key={`item-${index}`} style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}(${getPercent(entry.value, total)})`}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  return (
    <main className="main-geral">
      <h1>Analise Estatistica Geral</h1>

      
      <div className="last-month-infos">
        <h2>Relatorio Último mês:</h2>

        <div className="graficos-iniciais">
          <div className="relacao-custo-ganho">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={data}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nome_chave" />
                <YAxis />
                <Tooltip />
                <Legend />
                <ReferenceLine y={0} stroke="#000" />
                <Bar dataKey="faturamento_total" fill="#8884d8" />
                <Bar dataKey="custo_folha" fill="#82ca9d" />
                <Bar dataKey="custo_fixo_total" fill="#0088FE" />
                <Bar dataKey="custo_operacional_total" fill="#00C49F" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="relacao-custo-departamentos">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  onMouseEnter={onPieEnter}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="info-r-tempo">

          <div className="info-r info-block">

              <div className="info-text">Média rentabilidade: {(data[0]?.media_rentabilidade)?.toLocaleString('pt-BR',{minimumFractionDigits: 2,maximumFractionDigits: 2,})|| 'Carregando...'}</div>
              
              <div className="info-text">QTD abaixo de 1: {(data[0]?.qtd_m_1)|| 'Carregando...'}</div>

              <div className="info-text">QTD abaixo da média: {(data[0]?.qtd_m_media)|| 'Carregando...'}</div>

          </div>

          <div className="info-tempo info-block">

            <div className="info-text">Média Tempo: {(data[0]?.media_tempo)?.toLocaleString('pt-BR',{minimumFractionDigits: 2,maximumFractionDigits: 2,})|| 'Carregando...'} Horas/mês</div>

            <div className="info-text">relação media-total tempo: {((data[0]?.rel_tempo_total)*100)?.toLocaleString('pt-BR',{minimumFractionDigits: 2,maximumFractionDigits: 2,})+'%'|| 'Carregando...'}</div>

          </div>

        </div>
        

        <div className="acompanhamento-infos">

          <h2>Acompanhamento da empresa:</h2>

          <div className="relacao-custos box-periodo">

            <ResponsiveContainer width={"100%"} height={"100%"}>
                <LineChart data={dataPeriodo} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="data" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="faturamento_total" stroke="#8884d8" isAnimationActive={true} animationDuration={2000}  animationEasing="ease-out" />
                  <Line type="monotone" dataKey="custo_fixo_total" stroke="#82ca9d" isAnimationActive={true} animationDuration={2000}  animationEasing="ease-out" />
                  <Line type="monotone" dataKey="custo_folha" stroke="#ff7300" isAnimationActive={true} animationDuration={2000}  animationEasing="ease-out"  />
                  <Line type="monotone" dataKey="custo_operacional_total" stroke="#00C49F" isAnimationActive={true} animationDuration={2000}  animationEasing="ease-out"  />
                </LineChart>
            </ResponsiveContainer>

          </div>

          <div className="rel-departamentos box-periodo">

            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                width={500}
                height={400}
                data={dataPeriodo}
                stackOffset="expand"
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
              > 
                <CartesianGrid strokeDasharray="3 3" />
                <Legend />
                <XAxis dataKey="data" />
                <YAxis tickFormatter={toPercent} />
                <Tooltip content={renderTooltipContent} />
                <Area type="monotone" dataKey="custo_contabil_total" stackId="1" stroke="#8884d8" fill="#8884d8" />
                <Area type="monotone" dataKey="custo_dp_total" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                <Area type="monotone" dataKey="custo_fiscal_total" stackId="1" stroke="#ffc658" fill="#ffc658" />
              </AreaChart>
            </ResponsiveContainer>

          </div>

          <div className="media-r  box-periodo">

            <ResponsiveContainer width={"100%"} height={"100%"}>
                  <LineChart data={dataPeriodo} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="data" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="media_rentabilidade" stroke="#8884d8" isAnimationActive={true} animationDuration={2000}  animationEasing="ease-out" />
                  </LineChart>
              </ResponsiveContainer>

          </div>

          <div className="distribuicao-r box-periodo">

            <ResponsiveContainer width={"100%"} height={"100%"}>
                    <LineChart data={dataPeriodo} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="data" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="qtd_m_1" stroke="#8884d8" isAnimationActive={true} animationDuration={2000}  animationEasing="ease-out" />
                      <Line type="monotone" dataKey="qtd_m_media" stroke="#ff7300" isAnimationActive={true} animationDuration={2000}  animationEasing="ease-out"  />
                    </LineChart>
            </ResponsiveContainer>


          </div>

          <div className="media-tempo box-periodo">

          <ResponsiveContainer width={"100%"} height={"100%"}>
                    <LineChart data={dataPeriodo} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="data" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="media_tempo" stroke="#8884d8" isAnimationActive={true} animationDuration={2000}  animationEasing="ease-out" />
                    </LineChart>
            </ResponsiveContainer>

          </div>

          <div className="rel-media-tempototal box-periodo">

          <ResponsiveContainer width={"100%"} height={"100%"}>
                    <LineChart data={dataPeriodo} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="data" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="rel_tempo_total" stroke="#ff7300" isAnimationActive={true} animationDuration={2000}  animationEasing="ease-out" />
                    </LineChart>
            </ResponsiveContainer>

          </div>
            

        </div>


      </div>
    </main>
  );
};

export default Geral;
