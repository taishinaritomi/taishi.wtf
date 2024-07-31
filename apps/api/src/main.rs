use axum::{http::header, response::IntoResponse, routing::get, Router};
use clap::Parser;
use dotenvy::dotenv;
use libvips::{ops, VipsImage};
#[derive(Debug, Parser)]
pub struct Config {
    #[arg(long, env, hide_env_values = true)]
    pub port: u16,
}

#[tokio::main]
async fn main() {
    dotenv().ok();
    let config = Config::parse();

    let app = Router::new().route("/", get(index_handler));
    // .route("/a", get(index2_handler))
    // .route("/b", get(index3_handler));
    let addr = format!("0.0.0.0:{}", config.port);
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

// async fn index_handler() -> impl IntoResponse {
//     let pixel = Pixmap::new(2000, 2000).unwrap();

//     println!("size={}", pixel.data().len());

//     let data = pixel.encode_png().unwrap();

//     println!("encoded: size={}", data.len());

//     ([(header::CONTENT_TYPE, "image/png")], data)
// }

// async fn index2_handler() -> impl IntoResponse {
//     let width = 4000;
//     let height = 4000;
//     let start = Instant::now();
//     let img = image::RgbImage::new(width, height);
//     println!("created in {:?}", start.elapsed());

//     // let start = Instant::now();
//     // for (x, y, pixel) in img.enumerate_pixels_mut() {
//     //     let r = (0.3 * x as f32) as u8;
//     //     let b = (0.3 * y as f32) as u8;
//     //     *pixel = image::Rgb([r, 0, b]);
//     // }

//     // println!("filled in {:?}", start.elapsed());

//     let start = Instant::now();
//     img.save("./target/test.png").unwrap();
//     println!("saved in {:?}", start.elapsed());

//     let mut buf = Cursor::new(Vec::new());

//     let start = Instant::now();

//     let encoder = JpegEncoder::new_with_quality(&mut buf, 5);

//     encoder
//         .write_image(&img, width, height, ExtendedColorType::Rgb8)
//         .unwrap();

//     // img.write_to(&mut buf, image::ImageFormat::WebP).unwrap();
//     println!("encoded in {:?}", start.elapsed());

//     ([(header::CONTENT_TYPE, "image/webp")], buf.into_inner())
// }

async fn index_handler() -> impl IntoResponse {
    let image = VipsImage::image_new_matrix(10000, 10000).unwrap();

    (
        [(header::CONTENT_TYPE, "image/png")],
        ops::pngsave_buffer(&image).unwrap(),
    )
}
