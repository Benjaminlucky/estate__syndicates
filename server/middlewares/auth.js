import jwt from "jsonwebtoken";

/**
 * verifyToken — general purpose guard for investor routes
 * Reads: Authorization: Bearer <token>
 * Attaches decoded payload to req.user on success
 */
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, emailAddress, iat, exp }
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Token expired, please log in again" });
    }
    return res.status(401).json({ message: "Invalid token" });
  }
};

/**
 * verifyAdmin — stricter guard for admin-only routes
 * Use this on routes where only admin tokens should be accepted.
 * Admin tokens are signed with the same JWT_SECRET but contain { id, email }
 * instead of { id, emailAddress } — we check both to keep it flexible.
 */
export const verifyAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Admin tokens carry `email`, investor tokens carry `emailAddress`
    if (!decoded.email) {
      return res.status(403).json({ message: "Admin access required" });
    }
    req.user = decoded; // { id, email, iat, exp }
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Token expired, please log in again" });
    }
    return res.status(401).json({ message: "Invalid token" });
  }
};

/**
 * verifyTeamMember — guard for team portal routes
 * Team tokens carry { id, email, role }
 */
export const verifyTeamMember = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.role) {
      return res.status(403).json({ message: "Team member access required" });
    }
    req.user = decoded; // { id, email, role, iat, exp }
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Token expired, please log in again" });
    }
    return res.status(401).json({ message: "Invalid token" });
  }
};

/**
 * verifySuperAdmin — super_admin role only
 * Used for admin user management (create/delete/update other admins).
 * Requires the token to carry email (admin token) AND role === "super_admin".
 */
export const verifySuperAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.email) {
      return res.status(403).json({ message: "Admin access required" });
    }
    if (decoded.role !== "super_admin") {
      return res.status(403).json({ message: "Super admin access required" });
    }
    req.user = decoded; // { id, email, role, iat, exp }
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Token expired, please log in again" });
    }
    return res.status(401).json({ message: "Invalid token" });
  }
};

/**
 * verifyManagerOrAbove — super_admin or manager
 * Used for investment approvals, payout recording, milestone management.
 * Viewers are blocked; managers and super_admins pass through.
 *
 * Falls back gracefully for existing admins whose tokens were issued before
 * the role field was added — if role is missing from the token, the admin is
 * treated as super_admin to avoid locking out existing users during migration.
 */
export const verifyManagerOrAbove = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.email) {
      return res.status(403).json({ message: "Admin access required" });
    }
    // If role is absent (old token before RBAC), treat as super_admin
    const role = decoded.role ?? "super_admin";
    if (!["super_admin", "manager"].includes(role)) {
      return res.status(403).json({ message: "Manager access required" });
    }
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Token expired, please log in again" });
    }
    return res.status(401).json({ message: "Invalid token" });
  }
};
