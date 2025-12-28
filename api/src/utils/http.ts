import axios, { AxiosInstance } from 'axios';

export class Http {
  private static client: AxiosInstance = axios.create({
    timeout: 15000, // 15 seconds
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  static async get<T = any>(url: string): Promise<T> {
    try {
      const response = await this.client.get<T>(url);
      return response.data;
    } catch (error) {
      console.error(`HTTP GET Error: ${url}`);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      console.error(error?.response?.data || error.message);
      throw new Error(`Failed to GET ${url}`);
    }
  }

  static async post<T = any>(url: string, body: any): Promise<T> {
    try {
      const response = await this.client.post<T>(url, body);
      return response.data;
    } catch (error) {
      console.error(`HTTP POST Error: ${url}`);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      console.error(error?.response?.data || error.message);
      throw new Error(`Failed to POST ${url}`);
    }
  }
}
