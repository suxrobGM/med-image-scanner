//@ts-ignore
import {Session} from "next-auth";
import {redirect} from "next/navigation";
import {auth} from "@/auth";
import {ApiException} from "@/core/exceptions";
import {
  BookmarkReportCommand,
  CreateOrganizationCommand,
  DicomWebUrlDto,
  DocumentDto,
  GetPatientQuery,
  GetStudiesQuery,
  GetStudySeriesQuery,
  InviteToOrgCommand,
  InviteUserCommand,
  JoinOrganizationCommand,
  OrgShortDetailsDto,
  OrganizationDto,
  PagedQuery,
  PagedResult,
  PatientDto,
  PredictSeriesCommand,
  RegisterUserCommand,
  ReportDto,
  RequestPasswordRecoveryCommand,
  ResetPasswordCommand,
  Result,
  SearchUserQuery,
  SearchableQuery,
  SeriesDto,
  StudyDto,
  UpdateOrganizationCommand,
  UpdatePasswordCommand,
  UpdateProfileCommand,
  UpdateReportCommand,
  UpdateUserOrgCommand,
  UpdateUserRoleCommand,
  UserDto,
  UserShortDetailsDto,
} from "@/core/models";
import {PaginationUtils} from "@/core/utils";

interface RequestOptions {
  /**
   * Client session object
   */
  session?: Session | null;
}

/**
 * Singleton service for interacting with the backend API.
 * You can define the backend base URL in the `NEXT_PUBLIC_BACKEND_URL` environment variable.
 *
 * For client components use methods with `use` prefix that uses `useSWR` hook under the hood.
 * @example
 * ```tsx
 * "use client";
 * import {ApiService} from "@/core/services";
 *
 * const {data: result, isLoading} = ApiService.ins.useGetPatientDocuments(patientId, paginationModel);
 * ```
 *
 * For server components use asynchronous methods without `use` prefix.
 * @example
 * ```tsx
 * import {ApiService} from "@/core/services";
 *
 * const result = await ApiService.ins.getPatientDocuments(patientId, paginationModel);
 * ```
 */
export class ApiService {
  private static instance: ApiService | null = null;
  private readonly baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api`;

  private constructor() {
    console.log("Backend URL:", process.env.NEXT_PUBLIC_BACKEND_URL);
    console.log("Viewer URL:", process.env.NEXT_PUBLIC_VIEWER_URL);
  }

  /**
   * Get the singleton instance of the ApiService
   */
  public static get ins(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  //#region Patient API

  /**
   * Get patient by id or MRN
   * @param query Get patient query
   * @returns Result object with patient data
   */
  getPatient(query: GetPatientQuery): Promise<Result<PatientDto>> {
    return this.get(`/patients/${query.patientId}?organization=${query.organization}`);
  }

  /**
   * Get all patients, optionally filtered by MRN, first name, last name, or date of birth
   * @returns Result object with patients
   */
  getPatients(query: SearchableQuery): Promise<PagedResult<PatientDto>> {
    const params = PaginationUtils.searchableQueryToParams(query);
    return this.get(`/patients?${params}`);
  }

  /**
   * Get patient studies
   * @param patientId Patient's ID
   * @param pagedQueryOptions Paged query options
   * @returns Paged result of case studies
   */
  getPatientStudies(
    patientId: string,
    pagedQueryOptions: PagedQuery
  ): Promise<PagedResult<StudyDto>> {
    const params = PaginationUtils.pagedQueryToParams(pagedQueryOptions);
    return this.get(`/patients/${patientId}/studies?${params}`);
  }

  /**
   * Get patient documents
   * @param patientId Patient's ID
   * @param pagedQueryOptions Paged query options
   * @returns Paged result of documents
   */
  getPatientDocuments(
    patientId: string,
    pagedQueryOptions: PagedQuery
  ): Promise<PagedResult<DocumentDto>> {
    const params = PaginationUtils.pagedQueryToParams(pagedQueryOptions);
    return this.get(`/patients/${patientId}/documents?${params}`);
  }

  //#endregion

  //#region User API

  getUser(userId: string): Promise<Result<UserDto>> {
    return this.get(`/users/${userId}`);
  }

  getUserOrganization(userId: string): Promise<Result<OrganizationDto>> {
    return this.get(`/users/${userId}/organization`);
  }

  getUsers(query: SearchUserQuery): Promise<PagedResult<UserDto>> {
    const params = PaginationUtils.searchableQueryToParams(query, {
      organizationName: query.organizationName,
      organizationId: query.organizationId,
    });

    return this.get(`/users?${params}`);
  }

  searchUsers(query: SearchUserQuery): Promise<PagedResult<UserShortDetailsDto>> {
    const params = PaginationUtils.pagedQueryToParams(query, {
      organizationName: query.organizationName,
      organizationId: query.organizationId,
    });

    return this.get(`/users/search/${query.search}?${params}`);
  }

  /**
   * Send an account creation invitation to the specified email address
   * @param command Invite user command
   * @returns Result object
   */
  inviteUser(command: InviteUserCommand): Promise<Result> {
    return this.post("/users/invite", command);
  }

  /**
   * Get user's saved reports
   * @param userId User ID
   * @returns Result object with array of saved reports
   */
  getUserBookmarkedReports(userId: string): Promise<Result<ReportDto[]>> {
    return this.get(`/users/${userId}/bookmarked-reports`);
  }

  /**
   * Check if the user has saved the specified report
   * @param userId User ID
   * @param reportId Report ID
   * @returns Result object with boolean value
   */
  hasUserBookmarkedReport(userId: string, reportId: string): Promise<Result<boolean>> {
    return this.get(`/users/${userId}/bookmarked-reports/${reportId}/exists`);
  }

  registerUser(command: RegisterUserCommand): Promise<Result> {
    return this.post("/users/register", command);
  }

  requestPasswordRecovery(command: RequestPasswordRecoveryCommand): Promise<Result> {
    return this.post("/users/password/recovery", command);
  }

  resetPassword(command: ResetPasswordCommand): Promise<Result> {
    return this.post("/users/password/reset", command);
  }

  updateUserRole(command: UpdateUserRoleCommand): Promise<Result> {
    return this.put(`/users/${command.userId}/role`, command);
  }

  updateUserOrganization(command: UpdateUserOrgCommand): Promise<Result> {
    return this.put(`/users/${command.userId}/organization`, command);
  }

  updateProfile(command: UpdateProfileCommand): Promise<Result> {
    return this.put(`/users/${command.userId}/profile`, command);
  }

  updatePassword(command: UpdatePasswordCommand): Promise<Result> {
    return this.put(`/users/${command.userId}/password`, command);
  }

  //#endregion

  //#region Report API

  /**
   * Get report by id
   * @param id Report ID
   * @returns Result object with report data
   */
  getReport(id: string): Promise<Result<ReportDto>> {
    return this.get(`/reports/${id}`);
  }

  /**
   * Save a report to the user's saved reports
   * @param command Save report command
   * @returns Result object
   */
  bookmarkReport(command: BookmarkReportCommand): Promise<Result> {
    return this.post("/reports/bookmark", command);
  }

  updateReport(command: UpdateReportCommand): Promise<Result> {
    return this.put(`/reports/${command.id}`, command);
  }

  //#endregion

  //#region Organization API

  /**
   * Get organization by ID or name
   * @param id Organization ID or name
   * @returns Result object with organization data
   */
  getOrganization(id: string): Promise<Result<OrganizationDto>> {
    return this.get(`/organizations/${id}`);
  }

  /**
   * Get DICOMWeb URL parameters for the organization
   * @param id Organization ID or name
   * @returns Result object with DICOMWeb URL parameters
   */
  getOrgDicomWebUrl(id: string): Promise<Result<DicomWebUrlDto>> {
    return this.get(`/organizations/${id}/dicomweb`);
  }

  /**
   * Get organizations paginated
   * @returns Result object with organizations
   */
  getOrganizations(query: SearchableQuery): Promise<PagedResult<OrganizationDto>> {
    const params = PaginationUtils.searchableQueryToParams(query);
    return this.get(`/organizations?${params}`);
  }

  /**
   * Get organization names paginated
   * @param query Search query
   * @returns Paged result object with organization names
   */
  searchOrganization(query: SearchableQuery): Promise<PagedResult<OrgShortDetailsDto>> {
    const params = PaginationUtils.pagedQueryToParams(query);
    return this.get(`/organizations/search/${query.search}?${params}`);
  }

  /**
   * Send an invitation email to the specified email address to join the organization
   * @param command Invite to organization command
   * @returns Result object
   */
  inviteToOrg(command: InviteToOrgCommand): Promise<Result> {
    return this.post("/organizations/invite", command);
  }

  /**
   * Join the organization with the specified invitation token
   * @param command Join to organization command
   * @returns Result object
   */
  joinOrganization(command: JoinOrganizationCommand): Promise<Result> {
    return this.post("/organizations/join", command);
  }

  createOrganization(command: CreateOrganizationCommand): Promise<Result> {
    return this.post("/organizations", command);
  }

  updateOrganization(command: UpdateOrganizationCommand): Promise<Result> {
    return this.put(`/organizations/${command.id}`, command);
  }

  deleteOrganization(id: string): Promise<Result> {
    return this.delete(`/organizations/${id}`);
  }

  //#endregion

  //#region Study API

  /**
   * Retrieve studies by patient ID and organization from DICOM server
   * @param query Get studies query
   * @returns Result object with array of studies
   */
  getStudies(query: GetStudiesQuery): Promise<Result<StudyDto[]>> {
    return this.get(`/studies?patientId=${query.patientId}&organization=${query.organization}`);
  }

  /**
   * Retrieve study series by study ID and organization from DICOM server
   * @param query Get study series query
   * @returns Result object with array of series
   */
  getStudySeries(query: GetStudySeriesQuery): Promise<Result<SeriesDto[]>> {
    return this.get(`/studies/${query.studyId}/series?organization=${query.organization}`);
  }

  /**
   * Predict the series using the specified ML model
   * @param command Predict series command
   * @returns Result object
   */
  predictSeries(command: PredictSeriesCommand): Promise<Result> {
    return this.post("/studies/series/predict", command);
  }

  //#endregion

  //#region HTTP Methods

  /**
   * Send a GET request to the backend API
   * @param endpoint API endpoint
   * @param session For the client clients specify the session object to retrieve the access token, you can get the session by calling `useSession` in client components
   * @returns Response object
   * @throws ApiException if response is not OK
   * @template TRes Response type
   */
  async get<TRes>(endpoint: string, options?: RequestOptions): Promise<TRes> {
    const session = await this.getSession(options);
    const headers = this.buildHeaders(session);
    const response = await fetch(`${this.baseUrl}${endpoint}`, {headers: headers});

    await this.handleError(response);
    return await (response.json() as TRes);
  }

  /**
   * Send a POST request to the backend API
   * @param endpoint API endpoint
   * @param body Request body
   * @returns Response object
   * @throws ApiException if response is not OK
   * @template TRes Response type
   */
  async post<TRes, TBody>(endpoint: string, body: TBody, options?: RequestOptions): Promise<TRes> {
    const session = await this.getSession(options);
    const headers = this.buildHeaders(session, "application/json");
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(body),
    });

    await this.handleError(response);
    return response.json() as TRes;
  }

  /**
   * Send a PUT request to the backend API
   * @param endpoint API endpoint
   * @param body Request body
   * @returns Response object
   * @throws ApiException if response is not OK
   * @template TRes Response type
   */
  async put<TRes, TBody>(endpoint: string, body: TBody, options?: RequestOptions): Promise<TRes> {
    const session = await this.getSession(options);
    const headers = this.buildHeaders(session, "application/json");
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "PUT",
      headers: headers,
      body: JSON.stringify(body),
    });

    await this.handleError(response);
    return response.json() as TRes;
  }

  /**
   * Send a DELETE request to the backend API
   * @param endpoint API endpoint
   * @returns Response object
   * @throws ApiException if response is not OK
   * @template TRes Response type
   */
  async delete<TRes>(endpoint: string, options?: RequestOptions): Promise<TRes> {
    const session = await this.getSession(options);
    const headers = this.buildHeaders(session);
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "DELETE",
      headers: headers,
    });

    await this.handleError(response);
    return response.json() as TRes;
  }

  //#endregion

  //#region Utility Methods

  /**
   * Get the session object
   * @param options Request options
   * @returns Session object
   */
  private async getSession(options?: RequestOptions): Promise<Session | null> {
    if (options?.session) {
      return Promise.resolve(options.session);
    }

    if (this.isClient()) {
      const {getSession} = await import("next-auth/react");
      const session = await getSession();
      return session;
    }

    return auth();
  }

  /**
   * Build request headers
   * @param session Session object
   * @param contentType Content type
   * @returns Headers object
   */
  private buildHeaders(session?: Session | null, contentType?: string): HeadersInit {
    const headers: HeadersInit = {};
    if (session?.user?.accessToken) {
      headers["Authorization"] = `Bearer ${session.user.accessToken}`;
    }
    if (contentType) {
      headers["Content-Type"] = contentType;
    }
    return headers;
  }

  /**
   * Handle API response errors, throws ApiException if response status code is not 200 or 400.
   * Status code 400 means that the server has processed the request but the client has sent invalid data.
   * Typcially, the server will return a JSON object with error messages in this case which can be displayed to the user.
   * @param response Response object
   * @throws ApiException if response is not OK
   */
  private async handleError(response: Response): Promise<void> {
    if (response.ok || response.status === 400) {
      return;
    }

    // Unauthorized, sign out the user
    // if (response.status === 401) {
    //   this.redirectSignOut();
    // }

    const responseText = await response.text();
    throw new ApiException(`${response.statusText}: ${responseText}`);
  }

  private redirectSignOut(): void {
    if (this.isClient()) {
      window.location.href = "/auth/signout";
    } else {
      redirect("/auth/signout");
    }
  }

  private isClient(): boolean {
    return typeof window !== "undefined";
  }

  //#endregion
}
