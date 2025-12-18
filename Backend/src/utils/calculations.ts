/**
 * Calcula a distância entre duas coordenadas usando a fórmula de Haversine
 * Retorna a distância em quilômetros
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Raio da Terra em km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Verifica se um restaurante está aberto no momento atual
 */
export function isRestauranteAberto(
  horarioAbertura: string | null,
  horarioFechamento: string | null,
  diasFuncionamento: string | null
): boolean {
  const agora = new Date();
  const diaSemana = agora.getDay(); // 0 = domingo, 1 = segunda, etc.
  const dias = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];
  const diaAtual = dias[diaSemana];

  // Verifica se o restaurante funciona no dia atual
  if (diasFuncionamento) {
    const diasArray = diasFuncionamento.split(',').map(d => d.trim());
    if (!diasArray.includes(diaAtual)) {
      return false;
    }
  }

  // Verifica horário
  if (!horarioAbertura || !horarioFechamento) {
    return true; // Se não tem horário definido, considera aberto
  }

  const [horaAbertura, minutoAbertura] = horarioAbertura.split(':').map(Number);
  const [horaFechamento, minutoFechamento] = horarioFechamento.split(':').map(Number);

  const agoraMinutos = agora.getHours() * 60 + agora.getMinutes();
  const aberturaMinutos = horaAbertura * 60 + minutoAbertura;
  const fechamentoMinutos = horaFechamento * 60 + minutoFechamento;

  // Se fecha depois da meia-noite
  if (fechamentoMinutos < aberturaMinutos) {
    return agoraMinutos >= aberturaMinutos || agoraMinutos <= fechamentoMinutos;
  }

  return agoraMinutos >= aberturaMinutos && agoraMinutos <= fechamentoMinutos;
}

/**
 * Verifica se um produto está disponível no horário atual
 */
export function isProdutoDisponivel(
  horarioInicio: string | null,
  horarioFim: string | null,
  disponivel: boolean,
  estoque: number | null
): boolean {
  if (!disponivel) return false;

  // Verifica estoque
  if (estoque !== null && estoque <= 0) {
    return false;
  }

  // Verifica horário
  if (!horarioInicio || !horarioFim) {
    return true; // Sem horário específico, sempre disponível
  }

  const agora = new Date();
  const agoraMinutos = agora.getHours() * 60 + agora.getMinutes();
  const [horaInicio, minutoInicio] = horarioInicio.split(':').map(Number);
  const [horaFim, minutoFim] = horarioFim.split(':').map(Number);

  const inicioMinutos = horaInicio * 60 + minutoInicio;
  const fimMinutos = horaFim * 60 + minutoFim;

  return agoraMinutos >= inicioMinutos && agoraMinutos <= fimMinutos;
}

/**
 * Calcula o tempo estimado total do pedido
 */
export function calcularTempoEstimado(
  tempoPreparo: number,
  tempoEntrega: number,
  tipoEntrega: string
): number {
  if (tipoEntrega === 'retirada') {
    return tempoPreparo;
  }
  return tempoPreparo + tempoEntrega;
}

/**
 * Calcula tempo adicional baseado em horários de pico
 * Horários de pico: 11h-14h (almoço) e 18h-21h (jantar)
 */
export function calcularTempoPico(): number {
  const agora = new Date();
  const hora = agora.getHours();
  const minuto = agora.getMinutes();
  const minutosTotais = hora * 60 + minuto;

  // Almoço: 11h00 - 14h00 (660 - 840 minutos)
  const inicioAlmoco = 11 * 60; // 660
  const fimAlmoco = 14 * 60; // 840

  // Jantar: 18h00 - 21h00 (1080 - 1260 minutos)
  const inicioJantar = 18 * 60; // 1080
  const fimJantar = 21 * 60; // 1260

  // Verifica se está em horário de pico
  const emPicoAlmoco = minutosTotais >= inicioAlmoco && minutosTotais <= fimAlmoco;
  const emPicoJantar = minutosTotais >= inicioJantar && minutosTotais <= fimJantar;

  if (emPicoAlmoco || emPicoJantar) {
    // Adiciona 15-30 minutos em horários de pico
    // Mais próximo do meio do horário = mais tempo adicional
    let tempoAdicional = 0;

    if (emPicoAlmoco) {
      const meioAlmoco = (inicioAlmoco + fimAlmoco) / 2; // 750
      const distanciaDoMeio = Math.abs(minutosTotais - meioAlmoco);
      const maxDistancia = (fimAlmoco - inicioAlmoco) / 2; // 90
      const intensidade = 1 - (distanciaDoMeio / maxDistancia);
      tempoAdicional = Math.round(15 + (intensidade * 15)); // 15 a 30 minutos
    }

    if (emPicoJantar) {
      const meioJantar = (inicioJantar + fimJantar) / 2; // 1170
      const distanciaDoMeio = Math.abs(minutosTotais - meioJantar);
      const maxDistancia = (fimJantar - inicioJantar) / 2; // 90
      const intensidade = 1 - (distanciaDoMeio / maxDistancia);
      tempoAdicional = Math.round(15 + (intensidade * 15)); // 15 a 30 minutos
    }

    return tempoAdicional;
  }

  return 0; // Fora de horário de pico
}

/**
 * Calcula tempo estimado considerando horários de pico
 */
export function calcularTempoEstimadoComPico(
  tempoPreparo: number,
  tempoEntrega: number,
  tipoEntrega: string
): number {
  const tempoBase = calcularTempoEstimado(tempoPreparo, tempoEntrega, tipoEntrega);
  const tempoPico = calcularTempoPico();
  return tempoBase + tempoPico;
}



