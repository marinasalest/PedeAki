import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import './NotaFiscalPage.css';

interface NotaFiscal {
  numero: string;
  dataEmissao: string;
  emitente: {
    nome: string;
    cnpj: string;
    endereco: any;
  };
  destinatario: {
    nome: string;
    cpf: string;
    endereco: any;
  };
  itens: Array<{
    numero: number;
    descricao: string;
    quantidade: number;
    valorUnitario: number;
    valorTotal: number;
  }>;
  totais: {
    subtotal: number;
    taxaEntrega: number;
    desconto: number;
    total: number;
  };
  pagamento: Array<{
    forma: string;
    valor: number;
    status: string;
  }>;
  chaveAcesso: string;
}

const NotaFiscalPage: React.FC = () => {
  const { pedidoId } = useParams<{ pedidoId: string }>();
  const [notaFiscal, setNotaFiscal] = useState<NotaFiscal | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (pedidoId && isAuthenticated) {
      loadNotaFiscal();
    }
  }, [pedidoId, isAuthenticated]);

  const loadNotaFiscal = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/pedidos/${pedidoId}/nota-fiscal`);
      setNotaFiscal(response.data.notaFiscal);
    } catch (err: any) {
      setError('Erro ao carregar nota fiscal: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const imprimir = () => {
    window.print();
  };

  if (!isAuthenticated) {
    return (
      <div className="card">
        <p>Você precisa estar logado para ver a nota fiscal.</p>
      </div>
    );
  }

  if (loading) {
    return <div className="card"><p>Carregando nota fiscal...</p></div>;
  }

  if (error) {
    return <div className="alert alert-error">{error}</div>;
  }

  if (!notaFiscal) {
    return <div className="card"><p>Nota fiscal não encontrada.</p></div>;
  }

  return (
    <div className="nota-fiscal-page">
      <div className="nota-fiscal-actions">
        <button className="btn btn-primary" onClick={imprimir}>
          🖨️ Imprimir
        </button>
      </div>

      <div className="nota-fiscal">
        <div className="nf-header">
          <h1>NOTA FISCAL ELETRÔNICA</h1>
          <div className="nf-numero">
            <p><strong>Nº:</strong> {notaFiscal.numero}</p>
            <p><strong>Chave de Acesso:</strong> {notaFiscal.chaveAcesso}</p>
          </div>
        </div>

        <div className="nf-section">
          <h3>EMITENTE</h3>
          <p><strong>{notaFiscal.emitente.nome}</strong></p>
          <p>CNPJ: {notaFiscal.emitente.cnpj}</p>
          <p>
            {notaFiscal.emitente.endereco.rua}, {notaFiscal.emitente.endereco.numero}
            <br />
            {notaFiscal.emitente.endereco.bairro} - {notaFiscal.emitente.endereco.cidade}/{notaFiscal.emitente.endereco.estado}
            <br />
            CEP: {notaFiscal.emitente.endereco.cep}
          </p>
        </div>

        <div className="nf-section">
          <h3>DESTINATÁRIO</h3>
          <p><strong>{notaFiscal.destinatario.nome}</strong></p>
          <p>CPF: {notaFiscal.destinatario.cpf}</p>
          <p>
            {notaFiscal.destinatario.endereco.rua}, {notaFiscal.destinatario.endereco.numero}
            <br />
            {notaFiscal.destinatario.endereco.bairro} - {notaFiscal.destinatario.endereco.cidade}/{notaFiscal.destinatario.endereco.estado}
            <br />
            CEP: {notaFiscal.destinatario.endereco.cep}
          </p>
        </div>

        <div className="nf-section">
          <h3>ITENS</h3>
          <table className="nf-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Descrição</th>
                <th>Qtd</th>
                <th>Valor Unit.</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {notaFiscal.itens.map((item) => (
                <tr key={item.numero}>
                  <td>{item.numero}</td>
                  <td>{item.descricao}</td>
                  <td>{item.quantidade}</td>
                  <td>R$ {item.valorUnitario.toFixed(2)}</td>
                  <td>R$ {item.valorTotal.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="nf-section">
          <h3>TOTAIS</h3>
          <div className="nf-totais">
            <p>Subtotal: <strong>R$ {notaFiscal.totais.subtotal.toFixed(2)}</strong></p>
            <p>Taxa de Entrega: <strong>R$ {notaFiscal.totais.taxaEntrega.toFixed(2)}</strong></p>
            {notaFiscal.totais.desconto > 0 && (
              <p>Desconto: <strong>R$ {notaFiscal.totais.desconto.toFixed(2)}</strong></p>
            )}
            <p className="nf-total">TOTAL: <strong>R$ {notaFiscal.totais.total.toFixed(2)}</strong></p>
          </div>
        </div>

        <div className="nf-section">
          <h3>PAGAMENTO</h3>
          {notaFiscal.pagamento.map((pag, index) => (
            <div key={index}>
              <p><strong>Forma:</strong> {pag.forma}</p>
              <p><strong>Valor:</strong> R$ {pag.valor.toFixed(2)}</p>
              <p><strong>Status:</strong> {pag.status}</p>
            </div>
          ))}
        </div>

        <div className="nf-footer">
          <p>Data de Emissão: {new Date(notaFiscal.dataEmissao).toLocaleString('pt-BR')}</p>
          <p>Este documento é uma representação gráfica da Nota Fiscal Eletrônica</p>
        </div>
      </div>
    </div>
  );
};

export default NotaFiscalPage;












