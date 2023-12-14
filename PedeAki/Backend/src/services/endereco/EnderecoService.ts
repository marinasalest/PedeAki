import axios, { AxiosResponse } from 'axios';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

interface GoogleApiResponse {
  results: {
    address_components: AddressComponent[];
  }[];
}

interface EnderecoDetails {
  rua: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
}

class EnderecoService {
    async getAddressDetails(cep: string): Promise<EnderecoDetails> {
        try {
            console.log('Requesting enderecoDetails for CEP:', cep);
            const enderecoDetails = await this.getEnderecoDetails(cep);
            console.log('enderecoDetails received:', enderecoDetails);
  
            const firstResult = enderecoDetails.results[0];
  
            if (firstResult && firstResult.address_components) {
                const addressComponents = firstResult.address_components;
          
                return {
                    rua: this.getComponentValue(addressComponents, 'route'),
                    numero: '', 
                    complemento: '', 
                    bairro: this.getComponentValue(addressComponents, 'sublocality'),
                    cidade: this.getComponentValue(addressComponents, 'administrative_area_level_2'),
                    estado: this.getComponentValue(addressComponents, 'administrative_area_level_1'),
                    cep: this.getComponentValue(addressComponents, 'postal_code'),
                };
            } else {
                throw new Error('Resultados de endereço ausentes ou inválidos.');
            }
        } catch (error) {
            console.error('Error in getAddressDetails:', error);
            throw error;
        }
    }


    private async getEnderecoDetails(cep: string): Promise<GoogleApiResponse> {
      try {
        const apiKey = 'AIzaSyArRTcMws5qc1c3t9afViUW3IJ9C8ZZvwQ';
        const response: AxiosResponse<GoogleApiResponse> = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${cep}&key=${apiKey}`);
        return response.data
      } catch (error) {
        console.error('Error in getEnderecoDetails:', error);
        throw error;
      }
    }

  async saveEndereco(enderecoDetails: EnderecoDetails): Promise<void> {

    try {
    // Salve os dados do endereço no banco de dados usando o Prisma
    await prisma.enderecos.create({
      data: {
        rua: enderecoDetails.rua,
        numero: enderecoDetails.numero,
        complemento: enderecoDetails.complemento,
        bairro: enderecoDetails.bairro,
        cidade: enderecoDetails.cidade,
        estado: enderecoDetails.estado,
        cep: enderecoDetails.cep,
      },
    });
    }catch (error) {
    console.error('Error in saveEndereco:', error);
    throw error;
    }
  }

  private getComponentValue(components: AddressComponent[], type: string): string {
    const component = components.find(comp => comp.types.includes(type));
    return component?.long_name || '';
  }
}

export default EnderecoService;
