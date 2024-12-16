#include <stdio.h>
 
const unsigned int STEPS = 10000;
const unsigned int TRAJECTORIES = 20;

struct Point {
    double x, y, z;
};

struct Image {
    unsigned char r, g, b;
};

__global__ void rossler(Point* points, double dt, int steps) {
    int i = blockIdx.x;
    for (int j = 1; j < steps; ++j) {
        Point prev_point = points[i * steps + j - 1];
        points[i * STEPS + j].x = prev_point.x + dt*(- prev_point.y - prev_point.z);
        points[i * STEPS + j].y = prev_point.y + dt*(prev_point.x + 0.2 * prev_point.y);
        points[i * STEPS + j].z = prev_point.z + dt*(0.2 + prev_point.z * (prev_point.x - 5.7));
    }
}

int main() {

    Point* host_points = (Point*) malloc(TRAJECTORIES * STEPS * sizeof(Point));
    Point* device_points;

    // intialize host_points with random [-10,10] values
    for (int i = 0; i < TRAJECTORIES; ++i) {
        host_points[i * STEPS + 0].x = (rand() / (double)RAND_MAX) * 40 - 20;
        host_points[i * STEPS + 0].y = (rand() / (double)RAND_MAX) * 40 - 20;
        host_points[i * STEPS + 0].z = (rand() / (double)RAND_MAX) * 40 - 20;
    }

    cudaMalloc(&device_points, TRAJECTORIES * STEPS * sizeof(Point));
    cudaMemcpy(device_points, host_points, TRAJECTORIES * STEPS * sizeof(Point), cudaMemcpyHostToDevice);

    printf("initialization done\n");

    // launch kernel
    dim3 block(TRAJECTORIES);
    rossler<<<block, 1>>>(device_points, 0.01, STEPS);
    cudaMemcpy(host_points, device_points, TRAJECTORIES * STEPS * sizeof(Point), cudaMemcpyDeviceToHost);

    printf("kernel done\n");

    // write to file
    FILE* file = fopen("rossler.txt", "w");
    for (int i = 0; i < TRAJECTORIES; ++i) {
        for (int j = 0; j < STEPS; ++j) {
            fprintf(file, "%f %f %f\n", host_points[i * STEPS + j].x, host_points[i * STEPS + j].y, host_points[i * STEPS + j].z);
        }
    }

    printf("file written\n");

    return 0;
}
