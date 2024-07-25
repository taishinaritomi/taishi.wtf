FROM rust:1.77.2

WORKDIR /app

COPY . /app

RUN cargo build --release

CMD ["/app/target/release/taishi-wtf-api"]
