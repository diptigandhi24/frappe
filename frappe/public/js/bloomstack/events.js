// Framework events
export const EVT_BROADCAST = Symbol("broadcast");
export const EVT_CONSTRUCT = Symbol("construct");
export const EVT_INIT = Symbol("init");
export const EVT_INITIALIZED = Symbol("initialized");
export const EVT_BEFORE_INIT = Symbol("before_init");
export const EVT_AFTER_INIT = Symbol("after_init");

// Parent and Child Controller events
export const EVT_CHILD_CONTROLLER_ADDED = Symbol("child_controller_added");
export const EVT_CHILD_CONTROLLER_REMOVED = Symbol("child_controller_removed");
export const EVT_PARENT_CONTROLLER_SET = Symbol("parent_controller_set");
export const EVT_PARENT_CONTROLLER_UNSET = Symbol("parent_controller_unset");

// Tag events
export const EVT_TAG_ADDED = Symbol("tag_added");
export const EVT_TAG_REMOVED = Symbol("tag_removed");