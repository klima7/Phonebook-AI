FROM python:3.12.9

WORKDIR /app

# setup poetry
RUN pip install --no-cache-dir poetry
ENV PATH="/home/user/.local/bin:${PATH}"
ENV POETRY_NO_INTERACTION=1

# create non-root user
ARG USER_ID=1000
ARG GROUP_ID=1000
RUN addgroup --gid $GROUP_ID user && \
    useradd --uid $USER_ID --gid $GROUP_ID -ms /bin/bash user && \
    apt-get update && apt-get install -y sudo && \
    echo "user ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/user && \
    chmod 440 /etc/sudoers.d/user

# install dependencies
USER user
COPY poetry.lock pyproject.toml ./
RUN poetry install --no-cache

# copy everything
COPY . .

CMD sleep infinity
