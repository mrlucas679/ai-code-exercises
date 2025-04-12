function verifyUserAccess(user, resource, action) {
  // No user or not logged in
  if (!user || !user.id) {
    return false;
  }

  // Super admins can do anything
  if (user.role === 'superadmin') {
    return true;
  }

  // Check resource-specific permissions
  if (!resource || !resource.type) {
    return false;
  }

  // Check if user owns the resource
  const isOwner = resource.ownerId === user.id;

  // Resource type specific rules
  switch(resource.type) {
    case 'document':
      if (action === 'view' && resource.isPublic) {
        return true;
      }
      if (action === 'edit' || action === 'delete') {
        return isOwner || user.role === 'admin';
      }
      if (action === 'view') {
        return isOwner || user.role === 'admin' ||
               (resource.sharedWith && resource.sharedWith.includes(user.id));
      }
      break;

    case 'project':
      if (action === 'view') {
        return isOwner || user.role === 'admin' ||
               (resource.team && resource.team.members.includes(user.id));
      }
      if (action === 'edit') {
        return isOwner || user.role === 'admin' ||
               (resource.team && resource.team.editors.includes(user.id));
      }
      if (action === 'delete') {
        return isOwner || user.role === 'admin';
      }
      break;

    default:
      return false;
  }

  return false;
}