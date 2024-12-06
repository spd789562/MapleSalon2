import {
  type AttachmentLoader,
  type VertexAttachment,
  type Attachment,
  BoneData,
  IkConstraintData,
  SkeletonData,
  Skin,
  SlotData,
  BlendMode,
  Utils,
  Color,
  type NumberArrayLike,
  type Timeline,
  Animation,
  AttachmentTimeline,
  RGBATimeline,
  RotateTimeline,
  TranslateTimeline,
  ScaleTimeline,
  IkConstraintTimeline,
  DeformTimeline,
  DrawOrderTimeline,
  EventTimeline,
  type CurveTimeline2,
  EventData,
  Event,
  type CurveTimeline1,
  ScaleXTimeline,
  ScaleYTimeline,
} from '@esotericsoftware/spine-pixi-v8';
import { BinaryInput } from '@esotericsoftware/spine-core/dist/SkeletonBinary';

import { readCurve2 } from './SkeletonJsonV2';

export class SkeletonBinaryV2 {
  attachmentLoader: AttachmentLoader;

  scale = 1;

  constructor(attachmentLoader: AttachmentLoader) {
    this.attachmentLoader = attachmentLoader;
  }

  readSkeletonData(data: ArrayBuffer): SkeletonData {
    const skeletonData = new SkeletonData();
    const input = new BinaryInput(data);

    skeletonData.hash = input.readString() || null;
    skeletonData.version = input.readString() || null;
    skeletonData.width = input.readFloat();
    skeletonData.height = input.readFloat();

    const nonessential = input.readBoolean();

    if (nonessential) {
      skeletonData.imagesPath = input.readString() || null;
    }

    this.readBones(input, nonessential, skeletonData);
    this.readIkConstraint(input, skeletonData);
    this.readSlots(input, skeletonData);

    const defaultSkin = this.readSkin(input, 'default', nonessential);
    if (defaultSkin) {
      skeletonData.defaultSkin = defaultSkin;
      skeletonData.skins.push(defaultSkin);
    }

    const otherSkinCount = input.readInt(true);
    for (let i = 0; i < otherSkinCount; i++) {
      const skinName = input.readString() || '';
      const skin = this.readSkin(input, skinName, nonessential);
      if (skin) {
        skeletonData.skins.push(skin);
      }
    }

    this.readEvents(input, skeletonData);

    const animationCount = input.readInt(true);
    for (let i = 0; i < animationCount; i++) {
      const animationName = input.readString() || '';
      this.readAnimation(input, animationName, skeletonData);
    }

    return skeletonData;
  }
  readBones(
    input: BinaryInput,
    nonessential: boolean,
    skeletonData: SkeletonData,
  ) {
    const boneCount = input.readInt(true);
    for (let i = 0; i < boneCount; i++) {
      const name = input.readString() ?? '';
      const parentIndex = input.readInt(true) - 1;
      const parent =
        parentIndex === -1 ? null : skeletonData.bones[parentIndex];
      const data = new BoneData(i, name, parent);
      data.x = input.readFloat() * this.scale;
      data.y = input.readFloat() * this.scale;
      data.scaleX = input.readFloat();
      data.scaleY = input.readFloat();
      data.rotation = input.readFloat();
      data.length = input.readFloat() * this.scale;
      // flipX
      if (input.readBoolean()) {
        data.scaleX = -data.scaleX;
      }
      // flipY
      if (input.readBoolean()) {
        data.scaleY = -data.scaleY;
      }
      // inheritScale
      input.readBoolean();
      // inheritRotation
      input.readBoolean();
      if (nonessential) {
        // skip bone color
        input.readInt32();
      }
      skeletonData.bones.push(data);
    }
  }
  readSlots(input: BinaryInput, skeletonData: SkeletonData) {
    const slotCount = input.readInt(true);
    for (let i = 0; i < slotCount; i++) {
      const slotName = input.readString() ?? '';
      const boneData = skeletonData.bones[input.readInt(true)];
      const data = new SlotData(i, slotName, boneData);
      data.color.setFromColor(getColor(input));
      data.attachmentName = input.readString();
      data.blendMode = getBlendMode(input.readInt(true));
      skeletonData.slots.push(data);
    }
  }
  readIkConstraint(input: BinaryInput, skeletonData: SkeletonData) {
    const constraintCount = input.readInt(true);
    for (let i = 0; i < constraintCount; i++) {
      const constraintName = input.readString() ?? '';
      const data = new IkConstraintData(constraintName);
      const boneCount = input.readInt(true);
      for (let j = 0; j < boneCount; j++) {
        const boneIndex = input.readInt(true);
        const bone = skeletonData.bones[boneIndex];
        data.bones.push(bone);
      }
      data.target = skeletonData.bones[input.readInt(true)];
      data.mix = input.readFloat();
      data.bendDirection = input.readByte() === 1 ? 1 : -1;
      skeletonData.ikConstraints.push(data);
    }
  }
  readSkin(input: BinaryInput, skinName: string, nonessential: boolean) {
    const slotCount = input.readInt(true);
    if (slotCount === 0) {
      return null;
    }
    const skin = new Skin(skinName);
    for (let i = 0; i < slotCount; i++) {
      const slotIndex = input.readInt(true);
      const propertyCount = input.readInt(true);
      for (let j = 0; j < propertyCount; j++) {
        const attachmentName = input.readString() ?? '';
        const attachment = this.readAttachment(
          input,
          skin,
          attachmentName,
          nonessential,
        );
        if (attachment) {
          skin.setAttachment(slotIndex, attachmentName, attachment);
        }
      }
    }
    return skin;
  }
  readEvents(input: BinaryInput, skeletonData: SkeletonData) {
    const eventCount = input.readInt(true);
    for (let i = 0; i < eventCount; i++) {
      const name = input.readString() ?? '';
      const data = new EventData(name);
      data.intValue = input.readInt(false);
      data.floatValue = input.readFloat();
      data.stringValue = input.readString();
      skeletonData.events.push(data);
    }
  }
  readAnimation(input: BinaryInput, name: string, skeletonData: SkeletonData) {
    const timelines = new Array<Timeline>();

    // slots
    const slotTimelineCount = input.readInt(true);
    for (let i = 0; i < slotTimelineCount; i++) {
      const slotIndex = input.readInt(true);
      this.readSlotTimeline(input, slotIndex, skeletonData, timelines);
    }
    // bones
    const boneTimelineCount = input.readInt(true);
    for (let i = 0; i < boneTimelineCount; i++) {
      const boneIndex = input.readInt(true);
      this.readBoneTimeline(input, boneIndex, skeletonData, timelines);
    }
    // ik constraints
    const ikTimelineCount = input.readInt(true);
    for (let i = 0; i < ikTimelineCount; i++) {
      const ikIndex = input.readInt(true);
      this.readIkConstraintTimeline(input, ikIndex, skeletonData, timelines);
    }

    // ffd
    const ffdTimelineCount = input.readInt(true);
    for (let i = 0; i < ffdTimelineCount; i++) {
      const skinIndex = input.readInt(true);
      this.readDeformTimeline(input, skinIndex, skeletonData, timelines);
    }

    const drawOrderTimeline = this.readDrawOrderTimeline(input, skeletonData);
    drawOrderTimeline && timelines.push(drawOrderTimeline);

    const evnetTimeline = this.readEventTimeline(input, skeletonData);
    evnetTimeline && timelines.push(evnetTimeline);

    let duration = 0;
    for (const timeline of timelines) {
      duration = Math.max(duration, timeline.getDuration());
    }
    const animation = new Animation(name, timelines, duration);
    skeletonData.animations.push(animation);
  }
  readSlotTimeline(
    input: BinaryInput,
    slotIndex: number,
    skeletonData: SkeletonData,
    timelines: Timeline[],
  ) {
    const slot = skeletonData.slots[slotIndex];
    if (!slot) {
      throw new Error(`Slot not found: ${name}`);
    }
    const timelineCount = input.readInt(true);
    for (let i = 0; i < timelineCount; i++) {
      const timelineType = input.readUnsignedByte();
      const frameCount = input.readInt(true);
      if (timelineType === TIMELINE_COLOR) {
        const timeline = new RGBATimeline(
          frameCount,
          frameCount << 2,
          slotIndex,
        );
        let prevTime = input.readFloat();
        let prevColor = getColor(input);
        const lastFrame = frameCount - 1;
        for (let frame = 0; frame < frameCount; frame++) {
          timeline.setFrame(
            frame,
            prevTime,
            prevColor.r,
            prevColor.g,
            prevColor.b,
            prevColor.a,
          );
          if (frame === lastFrame) {
            break;
          }
          const curve = getCurve(input);
          const time = input.readFloat();
          const color = getColor(input);

          if (curve) {
            // biome-ignore format: it easier to read this way, skip
            readCurve2(curve, timeline, 0, frame, 0, 0, prevTime, time, prevColor.r, color.r, 1);
            // biome-ignore format: skip
            readCurve2(curve, timeline, 0, frame, 0, 1, prevTime, time, prevColor.g, color.g, 1);
            // biome-ignore format: skip
            readCurve2(curve, timeline, 0, frame, 0, 2, prevTime, time, prevColor.b, color.b, 1);
            // biome-ignore format: skip
            readCurve2(curve, timeline, 0, frame, 0, 3, prevTime, time, prevColor.a, color.a, 1);
          }
          prevTime = time;
          prevColor = color;
        }
        timelines.push(timeline);
      } else if (timelineType === TIMELINE_ATTACHMENT) {
        const timeline = new AttachmentTimeline(frameCount, slotIndex);
        for (let frame = 0; frame < frameCount; frame++) {
          timeline.setFrame(frame, input.readFloat(), input.readString());
        }
        timelines.push(timeline);
      }
    }
  }
  readBoneTimeline(
    input: BinaryInput,
    boneIndex: number,
    skeletonData: SkeletonData,
    timelines: Timeline[],
  ) {
    const bone = skeletonData.bones[boneIndex];
    if (!bone) {
      throw new Error(
        `Bone not found: ${boneIndex} when reading bone timeline`,
      );
    }
    const timelineCount = input.readInt(true);
    for (let i = 0; i < timelineCount; i++) {
      const timelineType = input.readByte();
      const frames = input.readInt(true);
      if (timelineType === TIMELINE_ROTATE) {
        const timeline = new RotateTimeline(frames, frames, boneIndex);
        timelines.push(readTimeline1(input, timeline, 1));
      } else if (timelineType === TIMELINE_TRANSLATE) {
        const timeline = new TranslateTimeline(frames, frames << 1, boneIndex);
        timelines.push(readTimeline2(input, timeline, this.scale));
      } else if (timelineType === TIMELINE_SCALE) {
        const timeline = new ScaleTimeline(frames, frames << 1, boneIndex);
        timelines.push(readTimeline2(input, timeline, this.scale));
      } else if (
        timelineType === TIMELINE_FLIPX ||
        timelineType === TIMELINE_FLIPY
      ) {
        const timeline =
          timelineType === TIMELINE_FLIPX
            ? new ScaleXTimeline(frames, frames, boneIndex)
            : new ScaleYTimeline(frames, frames, boneIndex);
        for (let frame = 0; frame < frames; frame++) {
          const time = input.readFloat();
          const value = (input.readBoolean() ? 1 : 0) * this.scale;
          timeline.setFrame(frame, time, value);
          timeline.setLinear(frame);
        }
        timelines.push(timeline);
      }
    }
  }
  readIkConstraintTimeline(
    input: BinaryInput,
    constraintIndex: number,
    skeletonData: SkeletonData,
    timelines: Timeline[],
  ) {
    const constraint = skeletonData.ikConstraints[constraintIndex];
    if (!constraint) {
      throw new Error(`IK constraint not found: ${name}`);
    }
    const frameCount = input.readInt(true);
    const timeline = new IkConstraintTimeline(
      frameCount,
      frameCount << 1,
      constraintIndex,
    );

    let prevTime = input.readFloat();
    let prevMix = input.readFloat();
    let prevBendPositive = input.readByte() === 1;
    const softness = 0;
    const lastFrame = frameCount - 1;
    for (let frame = 0, bezier = 0; frame < frameCount; frame++) {
      timeline.setFrame(
        frame,
        prevTime,
        prevMix,
        softness,
        prevBendPositive ? 1 : -1,
        false,
        false,
      );
      if (frame === lastFrame) {
        break;
      }
      const time = input.readFloat();
      const mix = input.readFloat();
      const bendPositive = input.readByte() === 1;
      if (frame + 1 < frameCount) {
        const curve = getCurve(input);
        if (curve) {
          // biome-ignore format: skip
          bezier = readCurve2(curve, timeline, bezier, frame, 0, 0, prevTime, time, prevMix, mix, this.scale);
        } else {
          timeline.setLinear(frame);
        }
      }
      prevTime = time;
      prevMix = mix;
      prevBendPositive = bendPositive;
    }
    timelines.push(timeline);
  }
  /* aka attachment/ffd timeline */
  readDeformTimeline(
    input: BinaryInput,
    skinIndex: number,
    skeletonData: SkeletonData,
    timelines: Timeline[],
  ) {
    const skin = skeletonData.skins[skinIndex];
    if (!skin) {
      throw new Error(`Skin not found at: ${skinIndex}`);
    }
    const slotCount = input.readInt(true);
    for (let i = 0; i < slotCount; i++) {
      const slotIndex = input.readInt(true);
      const timelineCount = input.readInt(true);
      for (let j = 0; j < timelineCount; j++) {
        const attachmentName = input.readString() ?? '';
        const frameCount = input.readInt(true);
        const attachment = skin.getAttachment(
          slotIndex,
          attachmentName,
        ) as VertexAttachment;
        if (!attachment) {
          throw new Error(`Attachment not found: ${attachmentName}`);
        }
        const timeline = new DeformTimeline(
          frameCount,
          frameCount,
          slotIndex,
          attachment,
        );
        const weighted = attachment.bones !== null;
        const vertices = attachment.vertices;
        const deformLength = weighted
          ? (vertices.length / 3) * 2
          : vertices.length;

        let prevTime = input.readFloat();
        for (let frame = 0, bezier = 0; ; frame++) {
          let end = input.readInt(true);
          let deform: NumberArrayLike;
          if (end !== 0) {
            deform = Utils.newFloatArray(deformLength);
            const start = input.readInt(true);
            end += start;
            if (this.scale === 1) {
              for (let v = start; v < end; v++) {
                deform[v] = input.readFloat();
              }
            } else {
              for (let v = start; v < end; v++) {
                deform[v] = input.readFloat() * this.scale;
              }
            }
            if (!weighted) {
              for (let v = 0; v < deformLength; v++) {
                deform[v] += vertices[v];
              }
            }
          } else {
            deform = weighted ? Utils.newFloatArray(deformLength) : vertices;
          }
          timeline.setFrame(frame, prevTime, deform);
          if (frame === frameCount - 1) {
            break;
          }
          const curve = getCurve(input);
          const time = input.readFloat();
          // biome-ignore format: skip
          if (curve) {
            bezier = readCurve2(curve, timeline, bezier, frame, 0, 0, prevTime, time, 0, 1, 1);
          } else {
            timeline.setLinear(frame);
          }
          prevTime = time;
        }
        timelines.push(timeline);
      }
    }
  }
  readDrawOrderTimeline(input: BinaryInput, skeletonData: SkeletonData) {
    const drawOrderCount = input.readInt(true);
    if (drawOrderCount < 1) {
      return null;
    }
    const timeline = new DrawOrderTimeline(drawOrderCount);
    const slotCount = skeletonData.slots.length;
    for (let i = 0; i < drawOrderCount; i++) {
      const offsets = input.readInt(true);
      const drawOrder = Utils.newArray(slotCount, -1);
      const unchanged = Utils.newArray(slotCount - offsets, -1);
      let originalIndex = 0;
      let unchangedIndex = 0;
      for (let j = 0; j < offsets; j++) {
        const slotIndex = input.readInt(true);
        // Collect unchanged items.
        while (originalIndex !== slotIndex) {
          unchanged[unchangedIndex++] = originalIndex++;
        }
        // Set changed items.
        drawOrder[originalIndex + input.readInt(true)] = originalIndex++;
      }
      // Collect remaining unchanged items.
      while (originalIndex < slotCount) {
        unchanged[unchangedIndex++] = originalIndex++;
      }
      // Fill in unchanged items.
      for (let j = slotCount - 1; j >= 0; j--) {
        if (drawOrder[j] === -1) {
          drawOrder[j] = unchanged[--unchangedIndex];
        }
      }
      timeline.setFrame(i, input.readFloat(), drawOrder);
    }
    return timeline;
  }
  readEventTimeline(input: BinaryInput, skeletonData: SkeletonData) {
    const eventCount = input.readInt(true);
    if (eventCount < 1) {
      return null;
    }
    const timeline = new EventTimeline(eventCount);
    for (let i = 0; i < eventCount; i++) {
      const time = input.readFloat();
      const eventData = skeletonData.events[input.readInt(true)];
      const event = new Event(Utils.toSinglePrecision(time), eventData);
      event.intValue = input.readInt(false);
      event.floatValue = input.readFloat();
      event.stringValue = input.readBoolean()
        ? input.readString()
        : eventData.stringValue;
      timeline.setFrame(i, event);
    }
    return timeline;
  }

  readAttachment(
    input: BinaryInput,
    skin: Skin,
    n: string,
    nonessential: boolean,
  ): Attachment | null {
    const scale = this.scale;
    const name = input.readString() ?? n;
    const attachmentType = input.readByte();
    switch (attachmentType) {
      case AttachmentType.Region: {
        const path = input.readString() ?? name;
        const region = this.attachmentLoader.newRegionAttachment(
          skin,
          name,
          path,
          null,
        );
        if (!region) {
          return null;
        }
        region.path = path;
        region.x = input.readFloat() * scale;
        region.y = input.readFloat() * scale;
        region.scaleX = input.readFloat();
        region.scaleY = input.readFloat();
        region.rotation = input.readFloat();
        region.width = input.readFloat() * scale;
        region.height = input.readFloat() * scale;
        region.color.setFromColor(getColor(input));
        region.region && region.updateRegion();

        return region;
      }
      case AttachmentType.BoundingBox: {
        const box = this.attachmentLoader.newBoundingBoxAttachment(skin, name);
        if (!box) {
          return null;
        }
        box.vertices = this.readFloatArray(input, scale);
        return box;
      }
      case AttachmentType.Mesh: {
        const path = input.readString() ?? name;
        const mesh = this.attachmentLoader.newMeshAttachment(
          skin,
          name,
          path,
          null,
        );
        if (!mesh) {
          return null;
        }
        mesh.path = path;
        mesh.regionUVs = this.readFloatArray(input, 1);
        mesh.worldVerticesLength = mesh.regionUVs.length;
        mesh.triangles = this.readShortArray(input);
        mesh.vertices = this.readFloatArray(input, scale);
        mesh.color.setFromColor(getColor(input));
        mesh.hullLength = input.readInt(true) * 2;
        if (nonessential) {
          mesh.edges = this.readIntArray(input);
          mesh.width = input.readFloat() * scale;
          mesh.height = input.readFloat() * scale;
        } else {
          /* @ts-ignore */
          mesh.edges = null;
        }
        mesh.region && mesh.updateRegion();
        return mesh;
      }
      case AttachmentType.SkinnedMesh: {
        const path = input.readString() ?? name;
        const mesh = this.attachmentLoader.newMeshAttachment(
          skin,
          name,
          path,
          null,
        );
        if (!mesh) {
          return null;
        }
        const uvs = this.readFloatArray(input, 1);
        const triangles = this.readShortArray(input);
        const vertexCount = input.readInt(true);
        const weights = new Array<number>();
        const bones = new Array<number>();
        for (let i = 0; i < vertexCount; i++) {
          // TODO: maybe Math.floor this
          const boneCount = input.readFloat();
          bones.push(boneCount);
          for (let nn = i + boneCount * 4; i < nn; i += 4) {
            bones.push(input.readFloat());
            weights.push(input.readFloat() * scale);
            weights.push(input.readFloat() * scale);
            weights.push(input.readFloat());
          }
        }
        mesh.bones = bones;
        mesh.vertices = weights;
        mesh.triangles = triangles;
        mesh.regionUVs = uvs;
        mesh.worldVerticesLength = uvs.length;
        mesh.color.setFromColor(getColor(input));
        mesh.hullLength = input.readInt(true) * 2;
        if (nonessential) {
          mesh.edges = this.readIntArray(input);
          mesh.width = input.readFloat() * scale;
          mesh.height = input.readFloat() * scale;
        } else {
          /* @ts-ignore */
          mesh.edges = null;
        }
        mesh.region && mesh.updateRegion();
        return mesh;
      }
      default:
        break;
    }
    return null;
  }
  private readFloatArray(input: BinaryInput, scale: number): number[] {
    const n = input.readInt(true);
    const array = new Array<number>(n);
    if (scale === 1) {
      for (let i = 0; i < n; i++) {
        array[i] = input.readFloat();
      }
    } else {
      for (let i = 0; i < n; i++) {
        array[i] = input.readFloat() * scale;
      }
    }
    return array;
  }
  private readShortArray(input: BinaryInput): number[] {
    const n = input.readInt(true);
    const array = new Array<number>(n);
    for (let i = 0; i < n; i++) {
      array[i] = (input.readByte() << 8) | input.readByte();
    }
    return array;
  }
  private readIntArray(input: BinaryInput): number[] {
    const n = input.readInt(true);
    const array = new Array<number>(n);
    for (let i = 0; i < n; i++) {
      array[i] = input.readInt(true);
    }
    return array;
  }
}

enum AttachmentType {
  Region = 0,
  BoundingBox = 1,
  Mesh = 2,
  SkinnedMesh = 3,
}

export function readTimeline1(
  input: BinaryInput,
  timeline: CurveTimeline1,
  scale: number,
) {
  let prevTime = input.readFloat();
  let prevValue1 = input.readFloat() * scale;
  for (
    let frame = 0, bezier = 0, frameLast = timeline.getFrameCount() - 1;
    ;
    frame++
  ) {
    timeline.setFrame(frame, prevTime, prevValue1);
    if (frame === frameLast) {
      break;
    }
    const curve = getCurve(input);
    const time = input.readFloat();
    const value1 = input.readFloat() * scale;
    if (curve) {
      // biome-ignore format: skip
      bezier = readCurve2(curve, timeline, bezier, frame, 0, 0, prevTime, time, prevValue1, value1, scale);
    } else {
      timeline.setLinear(frame);
    }
    prevTime = time;
    prevValue1 = value1;
  }
  return timeline;
}

export function readTimeline2(
  input: BinaryInput,
  timeline: CurveTimeline2,
  scale: number,
) {
  let prevTime = input.readFloat();
  let prevValue1 = input.readFloat() * scale;
  let prevValue2 = input.readFloat() * scale;
  for (
    let frame = 0, bezier = 0, frameLast = timeline.getFrameCount() - 1;
    ;
    frame++
  ) {
    timeline.setFrame(frame, prevTime, prevValue1, prevValue2);
    if (frame === frameLast) {
      break;
    }
    const curve = getCurve(input);
    const time = input.readFloat();
    const value1 = input.readFloat() * scale;
    const value2 = input.readFloat() * scale;
    if (curve) {
      // biome-ignore format: skip
      bezier = readCurve2(curve, timeline, bezier, frame, 0, 0, prevTime, time, prevValue1, value1, scale);
      // biome-ignore format: skip
      bezier = readCurve2(curve, timeline, bezier, frame, 0, 1, prevTime, time, prevValue2, value2, scale);
    } else {
      timeline.setLinear(frame);
    }
    prevTime = time;
    prevValue1 = value1;
    prevValue2 = value2;
  }
  return timeline;
}

export function getCurve(input: BinaryInput): 'stepped' | number[] | null {
  let curve: 'stepped' | number[] = 'stepped';
  const curveType = input.readByte();
  if (curveType === CURVE_LINEAR) {
    return null;
  }
  if (curveType === CURVE_BEZIER) {
    curve = [
      input.readFloat(),
      input.readFloat(),
      input.readFloat(),
      input.readFloat(),
    ];
  }
  return curve;
}

function getColor(input: BinaryInput): Color {
  return new Color(
    input.readUnsignedByte() / 255.0,
    input.readUnsignedByte() / 255.0,
    input.readUnsignedByte() / 255.0,
    input.readUnsignedByte() / 255.0,
  );
}

function getBlendMode(n: number): BlendMode {
  switch (n) {
    case 1:
      return BlendMode.Additive;
    case 2:
      return BlendMode.Multiply;
    case 3:
      return BlendMode.Screen;
    default:
      return BlendMode.Normal;
  }
}

function readInt(input: BinaryInput, optimizePositive: boolean) {
  let b = input.readByte();
  let result = b & 0x7f;
  if ((b & 0x80) !== 0) {
    b = input.readByte();
    result |= (b & 0x7f) << 7;
    if ((b & 0x80) !== 0) {
      b = input.readByte();
      result |= (b & 0x7f) << 14;
      if ((b & 0x80) !== 0) {
        b = input.readByte();
        result |= (b & 0x7f) << 21;
        if ((b & 0x80) !== 0) {
          b = input.readByte();
          result |= (b & 0x7f) << 28;
        }
      }
    }
  }
  return optimizePositive ? result : (result >> 1) ^ -(result & 1);
}

function peekBytes(input: BinaryInput, n: number) {
  /* @ts-ignore */
  const dv = input.buffer as DataView;
  /* @ts-ignore */
  const index = input.index;
  const dest = index + n;
  const tmp = new Uint8Array(n);
  for (let i = index; i < dest; i++) {
    tmp[i - index] = dv.getInt8(i);
  }
  return tmp;
}

const CURVE_LINEAR = 0;
const CURVE_STEPPED = 1;
const CURVE_BEZIER = 2;

const TIMELINE_SCALE = 0;
const TIMELINE_ROTATE = 1;
const TIMELINE_TRANSLATE = 2;
const TIMELINE_ATTACHMENT = 3;
const TIMELINE_COLOR = 4;
const TIMELINE_FLIPX = 5;
const TIMELINE_FLIPY = 6;
