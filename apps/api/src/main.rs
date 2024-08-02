use axum::{extract::Query, http::header, response::IntoResponse, routing::get, Router};
use clap::Parser;
use dotenvy::dotenv;
use libvips::ops::WebpsaveBufferOptions;
use serde::Deserialize;
#[derive(Debug, Parser)]
pub struct Config {
    #[arg(long, env, hide_env_values = true)]
    pub port: u16,
}

const HOST: &str = "0.0.0.0";

#[tokio::main]
async fn main() {
    dotenv().ok();
    let config = Config::parse();

    let app = Router::new().route("/", get(index_handler));
    let addr = format!("{}:{}", HOST, config.port);
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

#[derive(Default)]
enum ImageFormat {
    #[default]
    Png,
    Jpeg,
    Webp,
}

// impl Default for ImageFormat {
//     fn default() -> Self {
//         ImageFormat::PNG
//     }
// }

impl ImageFormat {
    fn from_str(format: &str) -> Self {
        match format {
            "png" => ImageFormat::Png,
            "jpg" => ImageFormat::Jpeg,
            "jpeg" => ImageFormat::Jpeg,
            "webp" => ImageFormat::Webp,
            _ => ImageFormat::Png,
        }
    }

    fn from_optional_str(format: Option<&String>) -> Self {
        match format {
            Some(format) => ImageFormat::from_str(format),
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

const IMAGE_MAX_SIZE: u16 = 20000;

fn clamp_size(size: Option<u16>) -> u16 {
    match size {
        Some(size) => {
            if size > IMAGE_MAX_SIZE {
                IMAGE_MAX_SIZE
            } else {
                size
            }
        }
        None => 150,
    }
}
#[derive(Deserialize)]
struct Pagination {
    width: Option<u16>,
    height: Option<u16>,
    format: Option<String>,
}

async fn index_handler(query: Query<Pagination>) -> impl IntoResponse {
    let width = clamp_size(query.width);
    let height = clamp_size(query.height);
    let format = ImageFormat::from_optional_str(query.format.as_ref());

    let image = libvips::VipsImage::image_new_matrix(width.into(), height.into()).unwrap();

    let content_type = format.content_type();

    let image_buf = match format {
        ImageFormat::Png => libvips::ops::pngsave_buffer(&image).unwrap(),
        ImageFormat::Jpeg => libvips::ops::jpegsave_buffer(&image).unwrap(),
        ImageFormat::Webp => {
            libvips::ops::webpsave_buffer_with_opts(&image, &WebpsaveBufferOptions::default())
                .unwrap()
        }
    };

    ([(header::CONTENT_TYPE, content_type)], image_buf)
}
