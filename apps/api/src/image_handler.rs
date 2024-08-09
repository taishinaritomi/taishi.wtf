use axum::{
    extract::Query,
    http::{header, StatusCode},
    response::IntoResponse,
};
use libvips::ops::BandFormat;
use serde::Deserialize;

#[derive(Default)]
enum ImageFormat {
    #[default]
    Png,
    Jpeg,
    Webp,
}

impl ImageFormat {
    fn new(format: &str) -> Self {
        match format {
            "png" => ImageFormat::Png,
            "jpg" => ImageFormat::Jpeg,
            "jpeg" => ImageFormat::Jpeg,
            "webp" => ImageFormat::Webp,
            _ => ImageFormat::Png,
        }
    }

    fn new_optional(format: Option<&str>) -> Self {
        match format {
            Some(format) => ImageFormat::new(format),
            None => ImageFormat::default(),
        }
    }

    fn content_type<'a>(&self) -> &'a str {
        match self {
            ImageFormat::Png => "image/png",
            ImageFormat::Jpeg => "image/jpeg",
            ImageFormat::Webp => "image/webp",
        }
    }
}

struct ImageSize {
    width: u16,
    height: u16,
}

impl Default for ImageSize {
    fn default() -> Self {
        Self {
            width: Self::DEFAULT_SIZE,
            height: Self::DEFAULT_SIZE,
        }
    }
}

impl ImageSize {
    const DEFAULT_SIZE: u16 = 150;
    const MAX_SIZE: u16 = 20000;

    fn new(width: u16, height: u16) -> Self {
        let width = Self::clamp_size(width);
        let height = Self::clamp_size(height);

        Self { width, height }
    }

    fn new_optional(width: Option<u16>, height: Option<u16>) -> Self {
        let width = width.unwrap_or(Self::DEFAULT_SIZE);
        let height = height.unwrap_or(Self::DEFAULT_SIZE);

        Self::new(width, height)
    }

    fn clamp_size(size: u16) -> u16 {
        if size > Self::MAX_SIZE {
            Self::MAX_SIZE
        } else {
            size
        }
    }
}

#[derive(Deserialize)]
pub struct ImageParams {
    width: Option<u16>,
    height: Option<u16>,
    format: Option<String>,
}

pub async fn image_handler(query: Query<ImageParams>) -> Result<impl IntoResponse, StatusCode> {
    let size = ImageSize::new_optional(query.width, query.height);
    let format = ImageFormat::new_optional(query.format.as_deref());

    let content_type = format.content_type();

    let data = image_handler_impl(&size, &format).map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(([(header::CONTENT_TYPE, content_type)], data))
}

fn image_handler_impl(size: &ImageSize, format: &ImageFormat) -> anyhow::Result<Vec<u8>> {
    let bands: u16 = 3;
    let band_format = BandFormat::Uchar;

    let buffer_size: usize = size.width as usize * size.height as usize * bands as usize;
    let buffer: Vec<u8> = vec![100u8; buffer_size];

    let image = libvips::VipsImage::new_from_memory(
        buffer.as_slice(),
        size.width.into(),
        size.height.into(),
        bands.into(),
        band_format,
    )?;

    // let text_options = TextOptions {
    //     // width: 100,
    //     autofit_dpi: -1,
    //     dpi: 10000,
    //     wrap: TextWrap::None,
    //     height: 100,
    //     width: 100,
    //     ..Default::default()
    // };

    // let text =

    let image_buf = match format {
        ImageFormat::Png => libvips::ops::pngsave_buffer(&image),
        ImageFormat::Jpeg => libvips::ops::jpegsave_buffer(&image),
        ImageFormat::Webp => libvips::ops::webpsave_buffer(&image),
    }?;

    // libvips::error::Error::TextError
    // text_with_opts("Hello, world!", &TextOptions::default())?;

    Ok(image_buf)
}

// #[inline]
// fn new_c_string(string: &str) -> anyhow::Result<CString> {
//     CString::new(string).map_err(|_| anyhow::Error::msg("Error initializing C string."))
// }

// const NULL: *const c_void = null_mut();

// pub fn text_with_opts(text: &str, text_options: &TextOptions) -> anyhow::Result<()> {
//     unsafe {
//         let text_in: CString = new_c_string(text)?;
//         let mut out: *mut bindings::VipsImage = null_mut();

//         let font_in: CString = new_c_string(&text_options.font)?;
//         let font_in_name = new_c_string("font")?;

//         let width_in: i32 = text_options.width;
//         let width_in_name = new_c_string("width")?;

//         let height_in: i32 = text_options.height;
//         let height_in_name = new_c_string("height")?;

//         let align_in: i32 = text_options.align as i32;
//         let align_in_name = new_c_string("align")?;

//         let justify_in: i32 = if text_options.justify { 1 } else { 0 };
//         let justify_in_name = new_c_string("justify")?;

//         let dpi_in: i32 = 72;
//         let dpi_in_name: CString = new_c_string("dpi")?;

//         // let autofit_dpi_in: i32 = 72;
//         // let autofit_dpi_in_name = new_c_string("autofit-dpi")?;

//         let spacing_in: i32 = text_options.spacing;
//         let spacing_in_name = new_c_string("spacing")?;

//         let fontfile_in: CString = new_c_string(&text_options.fontfile)?;
//         let fontfile_in_name = new_c_string("fontfile")?;

//         let rgba_in: i32 = if text_options.rgba { 1 } else { 0 };
//         let rgba_in_name = new_c_string("rgba")?;

//         let wrap_in: i32 = text_options.wrap as i32;
//         let wrap_in_name = new_c_string("wrap")?;

//         let vips_op_response = bindings::vips_text(
//             &mut out,
//             text_in.as_ptr(),
//             font_in_name.as_ptr(),
//             font_in.as_ptr(),
//             width_in_name.as_ptr(),
//             width_in,
//             height_in_name.as_ptr(),
//             height_in,
//             align_in_name.as_ptr(),
//             align_in,
//             justify_in_name.as_ptr(),
//             justify_in,
//             dpi_in_name.as_ptr(),
//             dpi_in,
//             // autofit_dpi_in_name.as_ptr(),
//             // autofit_dpi_in,
//             spacing_in_name.as_ptr(),
//             spacing_in,
//             fontfile_in_name.as_ptr(),
//             fontfile_in.as_ptr(),
//             rgba_in_name.as_ptr(),
//             rgba_in,
//             wrap_in_name.as_ptr(),
//             wrap_in,
//             NULL,
//         );

//         let vips = VipsImage::new();

//         Ok(())
//     }
// }
