// Explicit source orientation is independent of the requested court direction.
export function sourceFacing(entry,state,frame,poseIndex,pose={}){
 if(pose.portrait)return (pose.selection&&entry.selectionPortrait?entry.facing?.selection:entry.facing?.portrait)??entry.facing?.base??1;
 if(entry.motion)return entry.motion.sourceFacing[poseIndex];
 return entry.facing?.frames?.[Math.min(7,state)]?.[frame]??entry.facing?.base??1;
}
