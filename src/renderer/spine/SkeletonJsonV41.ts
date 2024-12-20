import {
  Animation,
  type Timeline,
  AttachmentTimeline,
  RGBATimeline,
  RGBTimeline,
  RGBA2Timeline,
  RGB2Timeline,
  AlphaTimeline,
  RotateTimeline,
  TranslateTimeline,
  TranslateXTimeline,
  TranslateYTimeline,
  ScaleTimeline,
  ScaleXTimeline,
  ScaleYTimeline,
  ShearTimeline,
  ShearXTimeline,
  ShearYTimeline,
  IkConstraintTimeline,
  TransformConstraintTimeline,
  PathConstraintPositionTimeline,
  PathConstraintSpacingTimeline,
  PathConstraintMixTimeline,
  DeformTimeline,
  DrawOrderTimeline,
  EventTimeline,
  type CurveTimeline1,
  type CurveTimeline2,
  type CurveTimeline,
  SequenceTimeline,
  type VertexAttachment,
  type Attachment,
  type AttachmentLoader,
  type MeshAttachment,
  BoneData,
  Event,
  EventData,
  IkConstraintData,
  PathConstraintData,
  PositionMode,
  SpacingMode,
  SkeletonData,
  Skin,
  SlotData,
  TransformConstraintData,
  Color,
  Utils,
  type NumberArrayLike,
  BlendMode,
  RotateMode,
} from '@esotericsoftware/spine-core';
import type { HasTextureRegion } from '@esotericsoftware/spine-core/dist/attachments/HasTextureRegion';
import {
  Sequence,
  SequenceMode,
} from '@esotericsoftware/spine-core/dist/attachments/Sequence';

export class SkeletonJsonV41 {
  attachmentLoader: AttachmentLoader;

  /** Scales bone positions, image sizes, and translations as they are loaded. This allows different size images to be used at
   * runtime than were used in Spine.
   *
   * See [Scaling](http://esotericsoftware.com/spine-loading-skeleton-data#Scaling) in the Spine Runtimes Guide. */
  scale = 1;
  private linkedMeshes = new Array<LinkedMesh>();

  constructor(attachmentLoader: AttachmentLoader) {
    this.attachmentLoader = attachmentLoader;
  }

  readSkeletonData(json: string | any): SkeletonData {
    const scale = this.scale;
    const skeletonData = new SkeletonData();
    const root = typeof json === 'string' ? JSON.parse(json) : json;

    // Skeleton
    const skeletonMap = root.skeleton;
    if (skeletonMap) {
      skeletonData.hash = skeletonMap.hash;
      skeletonData.version = skeletonMap.spine;
      skeletonData.x = skeletonMap.x;
      skeletonData.y = skeletonMap.y;
      skeletonData.width = skeletonMap.width;
      skeletonData.height = skeletonMap.height;
      skeletonData.fps = skeletonMap.fps;
      skeletonData.imagesPath = skeletonMap.images;
    }

    // Bones
    if (root.bones) {
      for (const boneMap of root.bones) {
        let parent: BoneData | null = null;
        const parentName: string = getValue(boneMap, 'parent', null);
        if (parentName) {
          parent = skeletonData.findBone(parentName);
        }
        const data = new BoneData(
          skeletonData.bones.length,
          boneMap.name,
          parent,
        );
        data.length = getValue(boneMap, 'length', 0) * scale;
        data.x = getValue(boneMap, 'x', 0) * scale;
        data.y = getValue(boneMap, 'y', 0) * scale;
        data.rotation = getValue(boneMap, 'rotation', 0);
        data.scaleX = getValue(boneMap, 'scaleX', 1);
        data.scaleY = getValue(boneMap, 'scaleY', 1);
        data.shearX = getValue(boneMap, 'shearX', 0);
        data.shearY = getValue(boneMap, 'shearY', 0);
        // data.transformMode = Utils.enumValue(
        //   TransformMode,
        //   getValue(boneMap, 'transform', 'Normal'),
        // );
        data.skinRequired = getValue(boneMap, 'skin', false);

        const color = getValue(boneMap, 'color', null);
        if (color) {
          data.color.setFromString(color);
        }

        skeletonData.bones.push(data);
      }
    }

    // Slots.
    if (root.slots) {
      for (const slotMap of root.slots) {
        const boneData = skeletonData.findBone(slotMap.bone);
        if (!boneData) {
          throw new Error(
            `Couldn't find bone ${slotMap.bone} for slot ${slotMap.name}`,
          );
        }
        const data = new SlotData(
          skeletonData.slots.length,
          slotMap.name,
          boneData,
        );

        const color: string = getValue(slotMap, 'color', null);
        if (color) {
          data.color.setFromString(color);
        }

        const dark: string = getValue(slotMap, 'dark', null);
        if (dark) {
          data.darkColor = Color.fromString(dark);
        }

        data.attachmentName = getValue(slotMap, 'attachment', null);
        data.blendMode = Utils.enumValue(
          BlendMode,
          getValue(slotMap, 'blend', 'normal'),
        );
        skeletonData.slots.push(data);
      }
    }

    // IK constraints
    if (root.ik) {
      for (const constraintMap of root.ik) {
        const data = new IkConstraintData(constraintMap.name);
        data.order = getValue(constraintMap, 'order', 0);
        data.skinRequired = getValue(constraintMap, 'skin', false);

        for (const boneName of constraintMap.bones) {
          const bone = skeletonData.findBone(boneName);
          if (!bone) {
            throw new Error(
              `Couldn't find bone ${boneName} for IK constraint ${constraintMap.name}.`,
            );
          }
          data.bones.push(bone);
        }

        const target = skeletonData.findBone(constraintMap.target);
        if (!target) {
          throw new Error(
            `Couldn't find target bone ${constraintMap.target} for IK constraint ${constraintMap.name}.`,
          );
        }
        data.target = target;

        data.mix = getValue(constraintMap, 'mix', 1);
        data.softness = getValue(constraintMap, 'softness', 0) * scale;
        data.bendDirection = getValue(constraintMap, 'bendPositive', true)
          ? 1
          : -1;
        data.compress = getValue(constraintMap, 'compress', false);
        data.stretch = getValue(constraintMap, 'stretch', false);
        data.uniform = getValue(constraintMap, 'uniform', false);

        skeletonData.ikConstraints.push(data);
      }
    }

    // Transform constraints.
    if (root.transform) {
      for (const constraintMap of root.transform) {
        const data = new TransformConstraintData(constraintMap.name);
        data.order = getValue(constraintMap, 'order', 0);
        data.skinRequired = getValue(constraintMap, 'skin', false);

        for (const boneName of constraintMap.bones) {
          const bone = skeletonData.findBone(boneName);
          if (!bone) {
            throw new Error(
              `Couldn't find bone ${boneName} for transform constraint ${constraintMap.name}.`,
            );
          }
          data.bones.push(bone);
        }

        const targetName: string = constraintMap.target;
        const target = skeletonData.findBone(targetName);
        if (!target) {
          throw new Error(
            `Couldn't find target bone ${targetName} for transform constraint ${constraintMap.name}.`,
          );
        }
        data.target = target;

        data.local = getValue(constraintMap, 'local', false);
        data.relative = getValue(constraintMap, 'relative', false);
        data.offsetRotation = getValue(constraintMap, 'rotation', 0);
        data.offsetX = getValue(constraintMap, 'x', 0) * scale;
        data.offsetY = getValue(constraintMap, 'y', 0) * scale;
        data.offsetScaleX = getValue(constraintMap, 'scaleX', 0);
        data.offsetScaleY = getValue(constraintMap, 'scaleY', 0);
        data.offsetShearY = getValue(constraintMap, 'shearY', 0);

        data.mixRotate = getValue(constraintMap, 'mixRotate', 1);
        data.mixX = getValue(constraintMap, 'mixX', 1);
        data.mixY = getValue(constraintMap, 'mixY', data.mixX);
        data.mixScaleX = getValue(constraintMap, 'mixScaleX', 1);
        data.mixScaleY = getValue(constraintMap, 'mixScaleY', data.mixScaleX);
        data.mixShearY = getValue(constraintMap, 'mixShearY', 1);

        skeletonData.transformConstraints.push(data);
      }
    }

    // Path constraints.
    if (root.path) {
      for (const constraintMap of root.path) {
        const data = new PathConstraintData(constraintMap.name);
        data.order = getValue(constraintMap, 'order', 0);
        data.skinRequired = getValue(constraintMap, 'skin', false);

        for (const boneName of constraintMap.bones) {
          const bone = skeletonData.findBone(boneName);
          if (!bone) {
            throw new Error(
              `Couldn't find bone ${boneName} for path constraint ${constraintMap.name}.`,
            );
          }
          data.bones.push(bone);
        }

        const targetName: string = constraintMap.target;
        const target = skeletonData.findSlot(targetName);
        if (!target) {
          throw new Error(
            `Couldn't find target slot ${targetName} for path constraint ${constraintMap.name}.`,
          );
        }
        data.target = target;

        data.positionMode = Utils.enumValue(
          PositionMode,
          getValue(constraintMap, 'positionMode', 'Percent'),
        );
        data.spacingMode = Utils.enumValue(
          SpacingMode,
          getValue(constraintMap, 'spacingMode', 'Length'),
        );
        data.rotateMode = Utils.enumValue(
          RotateMode,
          getValue(constraintMap, 'rotateMode', 'Tangent'),
        );
        data.offsetRotation = getValue(constraintMap, 'rotation', 0);
        data.position = getValue(constraintMap, 'position', 0);
        if (data.positionMode === PositionMode.Fixed) {
          data.position *= scale;
        }
        data.spacing = getValue(constraintMap, 'spacing', 0);
        if (
          data.spacingMode === SpacingMode.Length ||
          data.spacingMode === SpacingMode.Fixed
        ) {
          data.spacing *= scale;
        }
        data.mixRotate = getValue(constraintMap, 'mixRotate', 1);
        data.mixX = getValue(constraintMap, 'mixX', 1);
        data.mixY = getValue(constraintMap, 'mixY', data.mixX);

        skeletonData.pathConstraints.push(data);
      }
    }

    // Skins.
    if (root.skins) {
      for (const skinMap of root.skins) {
        const skin = new Skin(skinMap.name);

        if (skinMap.bones) {
          for (const boneName of skinMap.bones) {
            const bone = skeletonData.findBone(boneName);
            if (!bone) {
              throw new Error(
                `Couldn't find bone ${boneName} for skin ${skinMap.name}.`,
              );
            }
            skin.bones.push(bone);
          }
        }

        if (skinMap.ik) {
          for (const constraintName of skinMap.ik) {
            const constraint = skeletonData.findIkConstraint(constraintName);
            if (!constraint) {
              throw new Error(
                `Couldn't find IK constraint ${constraintName} for skin ${skinMap.name}.`,
              );
            }
            skin.constraints.push(constraint);
          }
        }

        if (skinMap.transform) {
          for (const constraintName of skinMap.transform) {
            const constraint =
              skeletonData.findTransformConstraint(constraintName);
            if (!constraint) {
              throw new Error(
                `Couldn't find transform constraint ${constraintName} for skin ${skinMap.name}.`,
              );
            }
            skin.constraints.push(constraint);
          }
        }

        if (skinMap.path) {
          for (const constraintName of skinMap.path) {
            const constraint = skeletonData.findPathConstraint(constraintName);
            if (!constraint) {
              throw new Error(
                `Couldn't find path constraint ${constraintName} for skin ${skinMap.name}.`,
              );
            }
            skin.constraints.push(constraint);
          }
        }

        for (const slotName in skinMap.attachments) {
          const slot = skeletonData.findSlot(slotName);
          if (!slot) {
            throw new Error(
              `Couldn't find slot ${slotName} for skin ${skinMap.name}.`,
            );
          }
          const slotMap = skinMap.attachments[slotName];
          for (const entryName in slotMap) {
            const attachment = this.readAttachment(
              slotMap[entryName],
              skin,
              slot.index,
              entryName,
              skeletonData,
            );
            if (attachment) {
              skin.setAttachment(slot.index, entryName, attachment);
            }
          }
        }
        skeletonData.skins.push(skin);
        if (skin.name === 'default') {
          skeletonData.defaultSkin = skin;
        }
      }
    }

    // Linked meshes.
    for (let i = 0, n = this.linkedMeshes.length; i < n; i++) {
      const linkedMesh = this.linkedMeshes[i];
      const skin = linkedMesh.skin
        ? skeletonData.findSkin(linkedMesh.skin)
        : skeletonData.defaultSkin;
      if (!skin) {
        throw new Error(`Skin not found: ${linkedMesh.skin}`);
      }
      const parent = skin.getAttachment(
        linkedMesh.slotIndex,
        linkedMesh.parent,
      );
      if (!parent) {
        throw new Error(`Parent mesh not found: ${linkedMesh.parent}`);
      }
      linkedMesh.mesh.timelineAttachment = linkedMesh.inheritTimeline
        ? <VertexAttachment>parent
        : <VertexAttachment>linkedMesh.mesh;
      linkedMesh.mesh.setParentMesh(<MeshAttachment>parent);
      if (linkedMesh.mesh.region !== null) {
        linkedMesh.mesh.updateRegion();
      }
    }
    this.linkedMeshes.length = 0;

    // Events.
    if (root.events) {
      for (const eventName in root.events) {
        const eventMap = root.events[eventName];
        const data = new EventData(eventName);
        data.intValue = getValue(eventMap, 'int', 0);
        data.floatValue = getValue(eventMap, 'float', 0);
        data.stringValue = getValue(eventMap, 'string', '');
        data.audioPath = getValue(eventMap, 'audio', null);
        if (data.audioPath) {
          data.volume = getValue(eventMap, 'volume', 1);
          data.balance = getValue(eventMap, 'balance', 0);
        }
        skeletonData.events.push(data);
      }
    }

    // Animations.
    if (root.animations) {
      for (const animationName in root.animations) {
        const animationMap = root.animations[animationName];
        this.readAnimation(animationMap, animationName, skeletonData);
      }
    }

    return skeletonData;
  }

  readAttachment(
    map: any,
    skin: Skin,
    slotIndex: number,
    name: string,
    skeletonData: SkeletonData,
  ): Attachment | null {
    const scale = this.scale;
    name = getValue(map, 'name', name);

    switch (getValue(map, 'type', 'region')) {
      case 'region': {
        const path = getValue(map, 'path', name);
        const sequence = this.readSequence(getValue(map, 'sequence', null));
        const region = this.attachmentLoader.newRegionAttachment(
          skin,
          name,
          path,
          sequence,
        );
        if (!region) {
          return null;
        }
        region.path = path;
        region.x = getValue(map, 'x', 0) * scale;
        region.y = getValue(map, 'y', 0) * scale;
        region.scaleX = getValue(map, 'scaleX', 1);
        region.scaleY = getValue(map, 'scaleY', 1);
        region.rotation = getValue(map, 'rotation', 0);
        region.width = map.width * scale;
        region.height = map.height * scale;
        region.sequence = sequence;

        const color: string = getValue(map, 'color', null);
        if (color) {
          region.color.setFromString(color);
        }

        if (region.region !== null) {
          region.updateRegion();
        }
        return region;
      }
      case 'boundingbox': {
        const box = this.attachmentLoader.newBoundingBoxAttachment(skin, name);
        if (!box) {
          return null;
        }
        this.readVertices(map, box, map.vertexCount << 1);
        const color: string = getValue(map, 'color', null);
        if (color) {
          box.color.setFromString(color);
        }
        return box;
      }
      case 'mesh':
      case 'linkedmesh': {
        const path = getValue(map, 'path', name);
        const sequence = this.readSequence(getValue(map, 'sequence', null));
        const mesh = this.attachmentLoader.newMeshAttachment(
          skin,
          name,
          path,
          sequence,
        );
        if (!mesh) {
          return null;
        }
        mesh.path = path;

        const color = getValue(map, 'color', null);
        if (color) {
          mesh.color.setFromString(color);
        }

        mesh.width = getValue(map, 'width', 0) * scale;
        mesh.height = getValue(map, 'height', 0) * scale;
        mesh.sequence = sequence;

        const parent: string = getValue(map, 'parent', null);
        if (parent) {
          this.linkedMeshes.push(
            new LinkedMesh(
              mesh,
              <string>getValue(map, 'skin', null),
              slotIndex,
              parent,
              getValue(map, 'timelines', true),
            ),
          );
          return mesh;
        }

        const uvs: number[] = map.uvs;
        this.readVertices(map, mesh, uvs.length);
        mesh.triangles = map.triangles;
        mesh.regionUVs = uvs;
        if (mesh.region !== null) {
          mesh.updateRegion();
        }

        mesh.edges = getValue(map, 'edges', null);
        mesh.hullLength = getValue(map, 'hull', 0) * 2;
        return mesh;
      }
      case 'path': {
        const path = this.attachmentLoader.newPathAttachment(skin, name);
        if (!path) {
          return null;
        }
        path.closed = getValue(map, 'closed', false);
        path.constantSpeed = getValue(map, 'constantSpeed', true);

        const vertexCount = map.vertexCount;
        this.readVertices(map, path, vertexCount << 1);

        const lengths: number[] = Utils.newArray(vertexCount / 3, 0);
        for (let i = 0; i < map.lengths.length; i++) {
          lengths[i] = map.lengths[i] * scale;
        }
        path.lengths = lengths;

        const color: string = getValue(map, 'color', null);
        if (color) {
          path.color.setFromString(color);
        }
        return path;
      }
      case 'point': {
        const point = this.attachmentLoader.newPointAttachment(skin, name);
        if (!point) {
          return null;
        }
        point.x = getValue(map, 'x', 0) * scale;
        point.y = getValue(map, 'y', 0) * scale;
        point.rotation = getValue(map, 'rotation', 0);

        const color = getValue(map, 'color', null);
        if (color) {
          point.color.setFromString(color);
        }
        return point;
      }
      case 'clipping': {
        const clip = this.attachmentLoader.newClippingAttachment(skin, name);
        if (!clip) {
          return null;
        }

        const end = getValue(map, 'end', null);
        if (end) {
          clip.endSlot = skeletonData.findSlot(end);
        }

        const vertexCount = map.vertexCount;
        this.readVertices(map, clip, vertexCount << 1);

        const color: string = getValue(map, 'color', null);
        if (color) {
          clip.color.setFromString(color);
        }
        return clip;
      }
      default:
        break;
    }
    return null;
  }

  readSequence(map: any) {
    if (map === null) {
      return null;
    }
    const sequence = new Sequence(getValue(map, 'count', 0));
    sequence.start = getValue(map, 'start', 1);
    sequence.digits = getValue(map, 'digits', 0);
    sequence.setupIndex = getValue(map, 'setup', 0);
    return sequence;
  }

  readVertices(map: any, attachment: VertexAttachment, verticesLength: number) {
    const scale = this.scale;
    attachment.worldVerticesLength = verticesLength;
    const vertices: number[] = map.vertices;
    if (verticesLength === vertices.length) {
      const scaledVertices = Utils.toFloatArray(vertices);
      if (scale !== 1) {
        for (let i = 0, n = vertices.length; i < n; i++) {
          scaledVertices[i] *= scale;
        }
      }
      attachment.vertices = scaledVertices;
      return;
    }
    const weights = new Array<number>();
    const bones = new Array<number>();
    for (let i = 0, n = vertices.length; i < n; ) {
      const boneCount = vertices[i++];
      bones.push(boneCount);
      for (let nn = i + boneCount * 4; i < nn; i += 4) {
        bones.push(vertices[i]);
        weights.push(vertices[i + 1] * scale);
        weights.push(vertices[i + 2] * scale);
        weights.push(vertices[i + 3]);
      }
    }
    attachment.bones = bones;
    attachment.vertices = Utils.toFloatArray(weights);
  }

  readAnimation(map: any, name: string, skeletonData: SkeletonData) {
    const scale = this.scale;
    const timelines = new Array<Timeline>();

    // Slot timelines.
    if (map.slots) {
      for (const slotName in map.slots) {
        const slotMap = map.slots[slotName];
        const slot = skeletonData.findSlot(slotName);
        if (!slot) {
          throw new Error(`Slot not found: ${slotName}`);
        }
        const slotIndex = slot.index;
        for (const timelineName in slotMap) {
          const timelineMap = slotMap[timelineName];
          if (!timelineMap) {
            continue;
          }
          const frames = timelineMap.length;
          if (timelineName === 'attachment') {
            const timeline = new AttachmentTimeline(frames, slotIndex);
            for (let frame = 0; frame < frames; frame++) {
              const keyMap = timelineMap[frame];
              timeline.setFrame(
                frame,
                getValue(keyMap, 'time', 0),
                getValue(keyMap, 'name', null),
              );
            }
            timelines.push(timeline);
          } else if (timelineName === 'rgba') {
            const timeline = new RGBATimeline(frames, frames << 2, slotIndex);
            let keyMap = timelineMap[0];
            let time = getValue(keyMap, 'time', 0);
            let color = Color.fromString(keyMap.color);

            for (let frame = 0, bezier = 0; ; frame++) {
              timeline.setFrame(
                frame,
                time,
                color.r,
                color.g,
                color.b,
                color.a,
              );
              const nextMap = timelineMap[frame + 1];
              if (!nextMap) {
                timeline.shrink(bezier);
                break;
              }
              const time2 = getValue(nextMap, 'time', 0);
              const newColor = Color.fromString(nextMap.color);
              const curve = keyMap.curve;
              if (curve) {
                // biome-ignore format: skip
                bezier = readCurve(curve, timeline, bezier, frame, 0, time, time2, color.r, newColor.r, 1);
                // biome-ignore format: skip
                bezier = readCurve(curve, timeline, bezier, frame, 1, time, time2, color.g, newColor.g, 1);
                // biome-ignore format: skip
                bezier = readCurve(curve, timeline, bezier, frame, 2, time, time2, color.b, newColor.b, 1);
                // biome-ignore format: skip
                bezier = readCurve(curve, timeline, bezier, frame, 3, time, time2, color.a, newColor.a, 1);
              }
              time = time2;
              color = newColor;
              keyMap = nextMap;
            }

            timelines.push(timeline);
          } else if (timelineName === 'rgb') {
            const timeline = new RGBTimeline(frames, frames * 3, slotIndex);
            let keyMap = timelineMap[0];
            let time = getValue(keyMap, 'time', 0);
            let color = Color.fromString(keyMap.color);

            for (let frame = 0, bezier = 0; ; frame++) {
              timeline.setFrame(frame, time, color.r, color.g, color.b);
              const nextMap = timelineMap[frame + 1];
              if (!nextMap) {
                timeline.shrink(bezier);
                break;
              }
              const time2 = getValue(nextMap, 'time', 0);
              const newColor = Color.fromString(nextMap.color);
              const curve = keyMap.curve;
              if (curve) {
                // biome-ignore format: skip
                bezier = readCurve(curve, timeline, bezier, frame, 0, time, time2, color.r, newColor.r, 1);
                // biome-ignore format: skip
                bezier = readCurve(curve, timeline, bezier, frame, 1, time, time2, color.g, newColor.g, 1);
                // biome-ignore format: skip
                bezier = readCurve(curve, timeline, bezier, frame, 2, time, time2, color.b, newColor.b, 1);
              }
              time = time2;
              color = newColor;
              keyMap = nextMap;
            }

            timelines.push(timeline);
          } else if (timelineName === 'alpha') {
            timelines.push(
              readTimeline1(
                timelineMap,
                new AlphaTimeline(frames, frames, slotIndex),
                0,
                1,
              ),
            );
          } else if (timelineName === 'rgba2') {
            const timeline = new RGBA2Timeline(frames, frames * 7, slotIndex);

            let keyMap = timelineMap[0];
            let time = getValue(keyMap, 'time', 0);
            let color = Color.fromString(keyMap.light);
            let color2 = Color.fromString(keyMap.dark);

            for (let frame = 0, bezier = 0; ; frame++) {
              timeline.setFrame(
                frame,
                time,
                color.r,
                color.g,
                color.b,
                color.a,
                color2.r,
                color2.g,
                color2.b,
              );
              const nextMap = timelineMap[frame + 1];
              if (!nextMap) {
                timeline.shrink(bezier);
                break;
              }
              const time2 = getValue(nextMap, 'time', 0);
              const newColor = Color.fromString(nextMap.light);
              const newColor2 = Color.fromString(nextMap.dark);
              const curve = keyMap.curve;
              if (curve) {
                // biome-ignore format: skip
                bezier = readCurve(curve, timeline, bezier, frame, 0, time, time2, color.r, newColor.r, 1);
                // biome-ignore format: skip
                bezier = readCurve(curve, timeline, bezier, frame, 1, time, time2, color.g, newColor.g, 1);
                // biome-ignore format: skip
                bezier = readCurve(curve, timeline, bezier, frame, 2, time, time2, color.b, newColor.b, 1);
                // biome-ignore format: skip
                bezier = readCurve(curve, timeline, bezier, frame, 3, time, time2, color.a, newColor.a, 1);
                // biome-ignore format: skip
                bezier = readCurve(curve, timeline, bezier, frame, 4, time, time2, color2.r, newColor2.r, 1);
                // biome-ignore format: skip
                bezier = readCurve(curve, timeline, bezier, frame, 5, time, time2, color2.g, newColor2.g, 1);
                // biome-ignore format: skip
                bezier = readCurve(curve, timeline, bezier, frame, 6, time, time2, color2.b, newColor2.b, 1);
              }
              time = time2;
              color = newColor;
              color2 = newColor2;
              keyMap = nextMap;
            }

            timelines.push(timeline);
          } else if (timelineName === 'rgb2') {
            const timeline = new RGB2Timeline(frames, frames * 6, slotIndex);

            let keyMap = timelineMap[0];
            let time = getValue(keyMap, 'time', 0);
            let color = Color.fromString(keyMap.light);
            let color2 = Color.fromString(keyMap.dark);

            for (let frame = 0, bezier = 0; ; frame++) {
              timeline.setFrame(
                frame,
                time,
                color.r,
                color.g,
                color.b,
                color2.r,
                color2.g,
                color2.b,
              );
              const nextMap = timelineMap[frame + 1];
              if (!nextMap) {
                timeline.shrink(bezier);
                break;
              }
              const time2 = getValue(nextMap, 'time', 0);
              const newColor = Color.fromString(nextMap.light);
              const newColor2 = Color.fromString(nextMap.dark);
              const curve = keyMap.curve;
              if (curve) {
                // biome-ignore format: skip
                bezier = readCurve(curve, timeline, bezier, frame, 0, time, time2, color.r, newColor.r, 1);
                // biome-ignore format: skip
                bezier = readCurve(curve, timeline, bezier, frame, 1, time, time2, color.g, newColor.g, 1);
                // biome-ignore format: skip
                bezier = readCurve(curve, timeline, bezier, frame, 2, time, time2, color.b, newColor.b, 1);
                // biome-ignore format: skip
                bezier = readCurve(curve, timeline, bezier, frame, 3, time, time2, color2.r, newColor2.r, 1);
                // biome-ignore format: skip
                bezier = readCurve(curve, timeline, bezier, frame, 4, time, time2, color2.g, newColor2.g, 1);
                // biome-ignore format: skip
                bezier = readCurve(curve, timeline, bezier, frame, 5, time, time2, color2.b, newColor2.b, 1);
              }
              time = time2;
              color = newColor;
              color2 = newColor2;
              keyMap = nextMap;
            }

            timelines.push(timeline);
          }
        }
      }
    }

    // Bone timelines.
    if (map.bones) {
      for (const boneName in map.bones) {
        const boneMap = map.bones[boneName];
        const bone = skeletonData.findBone(boneName);
        if (!bone) {
          throw new Error(`Bone not found: ${boneName}`);
        }
        const boneIndex = bone.index;
        for (const timelineName in boneMap) {
          const timelineMap = boneMap[timelineName];
          const frames = timelineMap.length;
          if (frames === 0) {
            continue;
          }

          if (timelineName === 'rotate') {
            timelines.push(
              readTimeline1(
                timelineMap,
                new RotateTimeline(frames, frames, boneIndex),
                0,
                1,
              ),
            );
          } else if (timelineName === 'translate') {
            const timeline = new TranslateTimeline(
              frames,
              frames << 1,
              boneIndex,
            );
            timelines.push(
              readTimeline2(timelineMap, timeline, 'x', 'y', 0, scale),
            );
          } else if (timelineName === 'translatex') {
            const timeline = new TranslateXTimeline(frames, frames, boneIndex);
            timelines.push(readTimeline1(timelineMap, timeline, 0, scale));
          } else if (timelineName === 'translatey') {
            const timeline = new TranslateYTimeline(frames, frames, boneIndex);
            timelines.push(readTimeline1(timelineMap, timeline, 0, scale));
          } else if (timelineName === 'scale') {
            const timeline = new ScaleTimeline(frames, frames << 1, boneIndex);
            timelines.push(
              readTimeline2(timelineMap, timeline, 'x', 'y', 1, 1),
            );
          } else if (timelineName === 'scalex') {
            const timeline = new ScaleXTimeline(frames, frames, boneIndex);
            timelines.push(readTimeline1(timelineMap, timeline, 1, 1));
          } else if (timelineName === 'scaley') {
            const timeline = new ScaleYTimeline(frames, frames, boneIndex);
            timelines.push(readTimeline1(timelineMap, timeline, 1, 1));
          } else if (timelineName === 'shear') {
            const timeline = new ShearTimeline(frames, frames << 1, boneIndex);
            timelines.push(
              readTimeline2(timelineMap, timeline, 'x', 'y', 0, 1),
            );
          } else if (timelineName === 'shearx') {
            const timeline = new ShearXTimeline(frames, frames, boneIndex);
            timelines.push(readTimeline1(timelineMap, timeline, 0, 1));
          } else if (timelineName === 'sheary') {
            const timeline = new ShearYTimeline(frames, frames, boneIndex);
            timelines.push(readTimeline1(timelineMap, timeline, 0, 1));
          }
        }
      }
    }

    // IK constraint timelines.
    if (map.ik) {
      for (const constraintName in map.ik) {
        const constraintMap = map.ik[constraintName];
        let keyMap = constraintMap[0];
        if (!keyMap) {
          continue;
        }

        const constraint = skeletonData.findIkConstraint(constraintName);
        if (!constraint) {
          throw new Error(`IK Constraint not found: ${constraintName}`);
        }
        const constraintIndex = skeletonData.ikConstraints.indexOf(constraint);
        const timeline = new IkConstraintTimeline(
          constraintMap.length,
          constraintMap.length << 1,
          constraintIndex,
        );

        let time = getValue(keyMap, 'time', 0);
        let mix = getValue(keyMap, 'mix', 1);
        let softness = getValue(keyMap, 'softness', 0) * scale;

        for (let frame = 0, bezier = 0; ; frame++) {
          timeline.setFrame(
            frame,
            time,
            mix,
            softness,
            getValue(keyMap, 'bendPositive', true) ? 1 : -1,
            getValue(keyMap, 'compress', false),
            getValue(keyMap, 'stretch', false),
          );
          const nextMap = constraintMap[frame + 1];
          if (!nextMap) {
            timeline.shrink(bezier);
            break;
          }

          const time2 = getValue(nextMap, 'time', 0);
          const mix2 = getValue(nextMap, 'mix', 1);
          const softness2 = getValue(nextMap, 'softness', 0) * scale;
          const curve = keyMap.curve;
          if (curve) {
            // biome-ignore format: skip
            bezier = readCurve(curve, timeline, bezier, frame, 0, time, time2, mix, mix2, 1);
            // biome-ignore format: skip
            bezier = readCurve(curve, timeline, bezier, frame, 1, time, time2, softness, softness2, scale);
          }

          time = time2;
          mix = mix2;
          softness = softness2;
          keyMap = nextMap;
        }
        timelines.push(timeline);
      }
    }

    // Transform constraint timelines.
    if (map.transform) {
      for (const constraintName in map.transform) {
        const timelineMap = map.transform[constraintName];
        let keyMap = timelineMap[0];
        if (!keyMap) {
          continue;
        }

        const constraint = skeletonData.findTransformConstraint(constraintName);
        if (!constraint) {
          throw new Error(`Transform constraint not found: ${constraintName}`);
        }
        const constraintIndex =
          skeletonData.transformConstraints.indexOf(constraint);
        const timeline = new TransformConstraintTimeline(
          timelineMap.length,
          timelineMap.length * 6,
          constraintIndex,
        );

        let time = getValue(keyMap, 'time', 0);
        let mixRotate = getValue(keyMap, 'mixRotate', 1);
        let mixX = getValue(keyMap, 'mixX', 1);
        let mixY = getValue(keyMap, 'mixY', mixX);
        let mixScaleX = getValue(keyMap, 'mixScaleX', 1);
        let mixScaleY = getValue(keyMap, 'mixScaleY', mixScaleX);
        const mixShearY = getValue(keyMap, 'mixShearY', 1);

        for (let frame = 0, bezier = 0; ; frame++) {
          timeline.setFrame(
            frame,
            time,
            mixRotate,
            mixX,
            mixY,
            mixScaleX,
            mixScaleY,
            mixShearY,
          );
          const nextMap = timelineMap[frame + 1];
          if (!nextMap) {
            timeline.shrink(bezier);
            break;
          }

          const time2 = getValue(nextMap, 'time', 0);
          const mixRotate2 = getValue(nextMap, 'mixRotate', 1);
          const mixX2 = getValue(nextMap, 'mixX', 1);
          const mixY2 = getValue(nextMap, 'mixY', mixX2);
          const mixScaleX2 = getValue(nextMap, 'mixScaleX', 1);
          const mixScaleY2 = getValue(nextMap, 'mixScaleY', mixScaleX2);
          const mixShearY2 = getValue(nextMap, 'mixShearY', 1);
          const curve = keyMap.curve;
          if (curve) {
            // biome-ignore format: skip
            bezier = readCurve(curve, timeline, bezier, frame, 0, time, time2, mixRotate, mixRotate2, 1);
            // biome-ignore format: skip
            bezier = readCurve(curve, timeline, bezier, frame, 1, time, time2, mixX, mixX2, 1);
            // biome-ignore format: skip
            bezier = readCurve(curve, timeline, bezier, frame, 2, time, time2, mixY, mixY2, 1);
            // biome-ignore format: skip
            bezier = readCurve(curve, timeline, bezier, frame, 3, time, time2, mixScaleX, mixScaleX2, 1);
            // biome-ignore format: skip
            bezier = readCurve(curve, timeline, bezier, frame, 4, time, time2, mixScaleY, mixScaleY2, 1);
            // biome-ignore format: skip
            bezier = readCurve(curve, timeline, bezier, frame, 5, time, time2, mixShearY, mixShearY2, 1);
          }

          time = time2;
          mixRotate = mixRotate2;
          mixX = mixX2;
          mixY = mixY2;
          mixScaleX = mixScaleX2;
          mixScaleY = mixScaleY2;
          mixScaleX = mixScaleX2;
          keyMap = nextMap;
        }
        timelines.push(timeline);
      }
    }

    // Path constraint timelines.
    if (map.path) {
      for (const constraintName in map.path) {
        const constraintMap = map.path[constraintName];
        const constraint = skeletonData.findPathConstraint(constraintName);
        if (!constraint) {
          throw new Error(`Path constraint not found: ${constraintName}`);
        }
        const constraintIndex =
          skeletonData.pathConstraints.indexOf(constraint);
        for (const timelineName in constraintMap) {
          const timelineMap = constraintMap[timelineName];
          let keyMap = timelineMap[0];
          if (!keyMap) {
            continue;
          }

          const frames = timelineMap.length;
          if (timelineName === 'position') {
            const timeline = new PathConstraintPositionTimeline(
              frames,
              frames,
              constraintIndex,
            );
            timelines.push(
              readTimeline1(
                timelineMap,
                timeline,
                0,
                constraint.positionMode === PositionMode.Fixed ? scale : 1,
              ),
            );
          } else if (timelineName === 'spacing') {
            const timeline = new PathConstraintSpacingTimeline(
              frames,
              frames,
              constraintIndex,
            );
            timelines.push(
              readTimeline1(
                timelineMap,
                timeline,
                0,
                constraint.spacingMode === SpacingMode.Length ||
                  constraint.spacingMode === SpacingMode.Fixed
                  ? scale
                  : 1,
              ),
            );
          } else if (timelineName === 'mix') {
            const timeline = new PathConstraintMixTimeline(
              frames,
              frames * 3,
              constraintIndex,
            );
            let time = getValue(keyMap, 'time', 0);
            let mixRotate = getValue(keyMap, 'mixRotate', 1);
            let mixX = getValue(keyMap, 'mixX', 1);
            let mixY = getValue(keyMap, 'mixY', mixX);
            for (let frame = 0, bezier = 0; ; frame++) {
              timeline.setFrame(frame, time, mixRotate, mixX, mixY);
              const nextMap = timelineMap[frame + 1];
              if (!nextMap) {
                timeline.shrink(bezier);
                break;
              }
              const time2 = getValue(nextMap, 'time', 0);
              const mixRotate2 = getValue(nextMap, 'mixRotate', 1);
              const mixX2 = getValue(nextMap, 'mixX', 1);
              const mixY2 = getValue(nextMap, 'mixY', mixX2);
              const curve = keyMap.curve;
              if (curve) {
                // biome-ignore format: skip
                bezier = readCurve(curve, timeline, bezier, frame, 0, time, time2, mixRotate, mixRotate2, 1);
                // biome-ignore format: skip
                bezier = readCurve(curve, timeline, bezier, frame, 1, time, time2, mixX, mixX2, 1);
                // biome-ignore format: skip
                bezier = readCurve(curve, timeline, bezier, frame, 2, time, time2, mixY, mixY2, 1);
              }
              time = time2;
              mixRotate = mixRotate2;
              mixX = mixX2;
              mixY = mixY2;
              keyMap = nextMap;
            }
            timelines.push(timeline);
          }
        }
      }
    }

    // Attachment timelines.
    if (map.attachments) {
      for (const attachmentsName in map.attachments) {
        const attachmentsMap = map.attachments[attachmentsName];
        const skin = skeletonData.findSkin(attachmentsName);
        if (!skin) {
          throw new Error(`Skin not found: ${attachmentsName}`);
        }
        for (const slotMapName in attachmentsMap) {
          const slotMap = attachmentsMap[slotMapName];
          const slot = skeletonData.findSlot(slotMapName);
          if (!slot) {
            throw new Error(`Slot not found: ${slotMapName}`);
          }
          const slotIndex = slot.index;
          for (const attachmentMapName in slotMap) {
            const attachmentMap = slotMap[attachmentMapName];
            const attachment = <VertexAttachment>(
              skin.getAttachment(slotIndex, attachmentMapName)
            );

            for (const timelineMapName in attachmentMap) {
              const timelineMap = attachmentMap[timelineMapName];
              let keyMap = timelineMap[0];
              if (!keyMap) {
                continue;
              }

              if (timelineMapName === 'deform') {
                const weighted = attachment.bones;
                const vertices = attachment.vertices;
                const deformLength = weighted
                  ? (vertices.length / 3) * 2
                  : vertices.length;

                const timeline = new DeformTimeline(
                  timelineMap.length,
                  timelineMap.length,
                  slotIndex,
                  attachment,
                );
                let time = getValue(keyMap, 'time', 0);
                for (let frame = 0, bezier = 0; ; frame++) {
                  let deform: NumberArrayLike;
                  const verticesValue: number[] = getValue(
                    keyMap,
                    'vertices',
                    null,
                  );
                  if (verticesValue) {
                    deform = Utils.newFloatArray(deformLength);
                    const start = <number>getValue(keyMap, 'offset', 0);
                    Utils.arrayCopy(
                      verticesValue,
                      0,
                      deform,
                      start,
                      verticesValue.length,
                    );
                    if (scale !== 1) {
                      for (
                        let i = start, n = i + verticesValue.length;
                        i < n;
                        i++
                      ) {
                        deform[i] *= scale;
                      }
                    }
                    if (!weighted) {
                      for (let i = 0; i < deformLength; i++) {
                        deform[i] += vertices[i];
                      }
                    }
                  } else {
                    deform = weighted
                      ? Utils.newFloatArray(deformLength)
                      : vertices;
                  }

                  timeline.setFrame(frame, time, deform);
                  const nextMap = timelineMap[frame + 1];
                  if (!nextMap) {
                    timeline.shrink(bezier);
                    break;
                  }
                  const time2 = getValue(nextMap, 'time', 0);
                  const curve = keyMap.curve;
                  if (curve) {
                    // biome-ignore format: skip
                    bezier = readCurve(curve, timeline, bezier, frame, 0, time, time2, 0, 1, 1);
                  }
                  time = time2;
                  keyMap = nextMap;
                }
                timelines.push(timeline);
              } else if (timelineMapName === 'sequence') {
                const timeline = new SequenceTimeline(
                  timelineMap.length,
                  slotIndex,
                  attachment as unknown as HasTextureRegion,
                );
                let lastDelay = 0;
                for (let frame = 0; frame < timelineMap.length; frame++) {
                  const delay = getValue(keyMap, 'delay', lastDelay);
                  const time = getValue(keyMap, 'time', 0);
                  const mode = SequenceMode[
                    getValue(keyMap, 'mode', 'hold')
                  ] as unknown as number;
                  const index = getValue(keyMap, 'index', 0);
                  timeline.setFrame(frame, time, mode, index, delay);
                  lastDelay = delay;
                  keyMap = timelineMap[frame + 1];
                }
                timelines.push(timeline);
              }
            }
          }
        }
      }
    }

    // Draw order timelines.
    if (map.drawOrder) {
      const timeline = new DrawOrderTimeline(map.drawOrder.length);
      const slotCount = skeletonData.slots.length;
      let frame = 0;
      for (let i = 0; i < map.drawOrder.length; i++, frame++) {
        const drawOrderMap = map.drawOrder[i];
        let drawOrder: number[] | null = null;
        const offsets = getValue(drawOrderMap, 'offsets', null);
        if (offsets) {
          drawOrder = Utils.newArray<number>(slotCount, -1);
          const unchanged = Utils.newArray<number>(
            slotCount - offsets.length,
            0,
          );
          let originalIndex = 0;
          let unchangedIndex = 0;
          for (const offsetMap of offsets) {
            const slot = skeletonData.findSlot(offsetMap.slot);
            if (!slot) {
              throw new Error(`Slot not found: ${slot}`);
            }
            const slotIndex = slot.index;
            // Collect unchanged items.
            while (originalIndex !== slotIndex) {
              unchanged[unchangedIndex++] = originalIndex++;
            }
            // Set changed items.
            drawOrder[originalIndex + offsetMap.offset] = originalIndex++;
          }
          // Collect remaining unchanged items.
          while (originalIndex < slotCount) {
            unchanged[unchangedIndex++] = originalIndex++;
          }
          // Fill in unchanged items.
          for (let ii = slotCount - 1; ii >= 0; ii--) {
            if (drawOrder[ii] === -1) {
              drawOrder[ii] = unchanged[--unchangedIndex];
            }
          }
        }
        timeline.setFrame(frame, getValue(drawOrderMap, 'time', 0), drawOrder);
      }
      timelines.push(timeline);
    }

    // Event timelines.
    if (map.events) {
      const timeline = new EventTimeline(map.events.length);
      let frame = 0;
      for (let i = 0; i < map.events.length; i++, frame++) {
        const eventMap = map.events[i];
        const eventData = skeletonData.findEvent(eventMap.name);
        if (!eventData) {
          throw new Error(`Event not found: ${eventMap.name}`);
        }
        const event = new Event(
          Utils.toSinglePrecision(getValue(eventMap, 'time', 0)),
          eventData,
        );
        event.intValue = getValue(eventMap, 'int', eventData.intValue);
        event.floatValue = getValue(eventMap, 'float', eventData.floatValue);
        event.stringValue = getValue(eventMap, 'string', eventData.stringValue);
        if (event.data.audioPath) {
          event.volume = getValue(eventMap, 'volume', 1);
          event.balance = getValue(eventMap, 'balance', 0);
        }
        timeline.setFrame(frame, event);
      }
      timelines.push(timeline);
    }

    let duration = 0;
    for (let i = 0, n = timelines.length; i < n; i++) {
      duration = Math.max(duration, timelines[i].getDuration());
    }
    skeletonData.animations.push(new Animation(name, timelines, duration));
  }
}

class LinkedMesh {
  parent: string;
  skin: string;
  slotIndex: number;
  mesh: MeshAttachment;
  inheritTimeline: boolean;

  constructor(
    mesh: MeshAttachment,
    skin: string,
    slotIndex: number,
    parent: string,
    inheritDeform: boolean,
  ) {
    this.mesh = mesh;
    this.skin = skin;
    this.slotIndex = slotIndex;
    this.parent = parent;
    this.inheritTimeline = inheritDeform;
  }
}

function readTimeline1(
  keys: any[],
  timeline: CurveTimeline1,
  defaultValue: number,
  scale: number,
) {
  let keyMap = keys[0];
  let time = getValue(keyMap, 'time', 0);
  let value = getValue(keyMap, 'value', defaultValue) * scale;
  let bezier = 0;
  for (let frame = 0; ; frame++) {
    timeline.setFrame(frame, time, value);
    const nextMap = keys[frame + 1];
    if (!nextMap) {
      timeline.shrink(bezier);
      return timeline;
    }
    const time2 = getValue(nextMap, 'time', 0);
    const value2 = getValue(nextMap, 'value', defaultValue) * scale;
    if (keyMap.curve) {
      // biome-ignore format: skip
      bezier = readCurve(keyMap.curve, timeline, bezier, frame, 0, time, time2, value, value2, scale);
    }
    time = time2;
    value = value2;
    keyMap = nextMap;
  }
}

function readTimeline2(
  keys: any[],
  timeline: CurveTimeline2,
  name1: string,
  name2: string,
  defaultValue: number,
  scale: number,
) {
  let keyMap = keys[0];
  let time = getValue(keyMap, 'time', 0);
  let value1 = getValue(keyMap, name1, defaultValue) * scale;
  let value2 = getValue(keyMap, name2, defaultValue) * scale;
  let bezier = 0;
  for (let frame = 0; ; frame++) {
    timeline.setFrame(frame, time, value1, value2);
    const nextMap = keys[frame + 1];
    if (!nextMap) {
      timeline.shrink(bezier);
      return timeline;
    }
    const time2 = getValue(nextMap, 'time', 0);
    const nvalue1 = getValue(nextMap, name1, defaultValue) * scale;
    const nvalue2 = getValue(nextMap, name2, defaultValue) * scale;
    const curve = keyMap.curve;
    if (curve) {
      // biome-ignore format: skip
      bezier = readCurve(curve, timeline, bezier, frame, 0, time, time2, value1, nvalue1, scale);
      // biome-ignore format: skip
      bezier = readCurve(curve, timeline, bezier, frame, 1, time, time2, value2, nvalue2, scale);
    }
    time = time2;
    value1 = nvalue1;
    value2 = nvalue2;
    keyMap = nextMap;
  }
}

function readCurve(
  curve: any,
  timeline: CurveTimeline,
  bezier: number,
  frame: number,
  value: number,
  time1: number,
  time2: number,
  value1: number,
  value2: number,
  scale: number,
) {
  if (curve === 'stepped') {
    timeline.setStepped(frame);
    return bezier;
  }
  const i = value << 2;
  const cx1 = curve[i];
  const cy1 = curve[i + 1] * scale;
  const cx2 = curve[i + 2];
  const cy2 = curve[i + 3] * scale;
  timeline.setBezier(
    bezier,
    frame,
    value,
    time1,
    value1,
    cx1,
    cy1,
    cx2,
    cy2,
    time2,
    value2,
  );
  return bezier + 1;
}

function getValue(map: any, property: string, defaultValue: any) {
  return map[property] !== undefined ? map[property] : defaultValue;
}
