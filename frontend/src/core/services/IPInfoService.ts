interface IPInfoResponse {
  ip: string;
  hostname: string;
  city: string;
  region: string;
  country: string;
  loc: string;
  org: string;
  postal: string;
  timezone: string;
}

export class IPInfoService {
  private static instance: IPInfoService | null = null;
  private readonly token = process.env.NEXT_PUBLIC_IPINFO_TOKEN!;

  private constructor() {
    if (!this.token) {
      throw new Error(
        "IPInfo token not provided, please set NEXT_PUBLIC_IPINFO_TOKEN in your environment variables"
      );
    }
  }

  /**
   * Get the singleton instance of the IPInfoService
   */
  public static get ins(): IPInfoService {
    if (!IPInfoService.instance) {
      IPInfoService.instance = new IPInfoService();
    }
    return IPInfoService.instance;
  }

  /**
   * Get the IP information for the current user
   */
  public async getIPInfo(): Promise<IPInfoResponse> {
    const response = await fetch(`https://ipinfo.io?token=${this.token}`);
    return response.json();
  }
}
