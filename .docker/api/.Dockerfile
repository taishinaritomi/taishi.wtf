FROM rust:1.80.0 AS build

WORKDIR /app

COPY ./apps/api /app/apps/api
COPY ./Cargo.toml /app/Cargo.toml
COPY ./Cargo.lock /app/Cargo.lock

RUN apt-get update && apt-get install -y libvips-dev

RUN cargo build --release

FROM rust:1.80.0 AS runtime

WORKDIR /app

COPY --from=build /app/target/release/taishi-wtf-api /app/target/release/taishi-wtf-api

RUN apt-get update && apt-get install -y --no-install-recommends libvips

CMD ["/app/target/release/taishi-wtf-api"]

