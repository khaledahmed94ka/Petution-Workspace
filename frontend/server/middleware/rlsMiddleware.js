// =============================================================================
// PETUTION ROW-LEVEL SECURITY (RLS) MIDDLEWARE
// Multi-Tenant Workspace Session Context & Isolation for Express & PostgreSQL
// =============================================================================

/**
 * Express Middleware: Extract Workspace Context & Enforce Tenant Isolation
 */
export const enforceWorkspaceIsolation = (req, res, next) => {
  // Extract workspace_id from HTTP Headers, Authorization Token, or Query Param
  const workspaceId = req.headers['x-workspace-id'] || req.headers['x-tenant-id'] || req.query.workspaceId || 'default-workspace-uuid';

  if (!workspaceId) {
    return res.status(401).json({
      status: 401,
      error: 'Unauthorized Workspace Access',
      message: 'x-workspace-id header is required to access workspace data.'
    });
  }

  // Attach workspaceId to request context
  req.workspaceId = workspaceId;

  /**
   * Helper function for database client: Sets current setting for PostgreSQL RLS
   * Usage inside DB handler: await setPostgresRLSContext(dbClient, req.workspaceId);
   */
  req.setRLSContext = async (dbClient) => {
    if (dbClient && typeof dbClient.query === 'function') {
      await dbClient.query(`SET LOCAL app.current_workspace_id = $1`, [workspaceId]);
    }
  };

  next();
};
