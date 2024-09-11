import {SearchableQuery} from "../SearchableQuery";

export interface SearchUserQuery extends SearchableQuery {
  /**
   * Filter by organization name
   */
  organizationName?: string;

  /**
   * Filter by organization ID
   */
  organizationId?: string;
}
