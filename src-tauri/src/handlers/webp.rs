use webp_animation::{Encoder, EncoderOptions, Error, WebPData};

// the data layout [width:u32, height:u32, frame_count:u32, (dealy:u32, frame_len:u32, frame_lens of data)*]

pub fn encode_wep_animation(data: &[u8]) -> Result<WebPData, Error> {
    let mut offset = 0;
    let width = pull_u32(data, &mut offset);
    let height = pull_u32(data, &mut offset);
    let frame_count = pull_u32(data, &mut offset);
    let mut ms = 0;
    let mut options = EncoderOptions::default();
    options.anim_params.loop_count = 0;
    let mut encoder = Encoder::new_with_options((width, height), options)?;
    for _ in 0..frame_count {
        let delay = pull_u32(data, &mut offset) as i32;
        let len = pull_u32(data, &mut offset) as usize;
        encoder.add_frame(&data[offset..offset + len], ms)?;

        offset += len;
        ms += delay;
    }
    encoder.finalize(ms)
}

#[inline]
fn pull_u32(data: &[u8], offset: &mut usize) -> u32 {
    let mut bytes = [0; 4];
    bytes.copy_from_slice(&data[*offset..*offset + 4]);
    *offset += 4;
    u32::from_le_bytes(bytes)
}
