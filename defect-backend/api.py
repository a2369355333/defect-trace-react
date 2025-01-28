from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import matplotlib.pyplot as plt
import numpy as np
import io
import base64
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def generate_chart_pie(num_points: int):
    plt.clf()
    angles = np.random.uniform(0, 2 * np.pi, num_points)
    radii = np.random.uniform(0, 10, num_points)
    x = 10 + radii * np.cos(angles)
    y = 10 + radii * np.sin(angles)

    fig, ax = plt.subplots()
    circle = plt.Circle((10, 10), 10, color="#c8c8c8", alpha=0.8, zorder=1)
    ax.add_patch(circle)
    ax.scatter(x, y, s=10, color="red", zorder=9999)
    ax.set_xlim(0, 20)
    ax.set_ylim(0, 20)
    ax.set_aspect('equal')
    ax.get_xaxis().set_visible(False)
    ax.get_yaxis().set_visible(False)
    plt.axis('off')

    buf = io.BytesIO()
    plt.savefig(buf, format='png', bbox_inches='tight', pad_inches=0)
    plt.close(fig)
    buf.seek(0)

    img_base64 = base64.b64encode(buf.getvalue()).decode('utf-8')
    return JSONResponse(content={'image': img_base64})

def generate_chart_box(num_points: int):
    data = np.random.uniform(0, 50, num_points)

    fig, ax = plt.subplots()
    ax.boxplot(data, positions=[1], widths=0.5)
    scatter_x = np.random.normal(1, 0.1, num_points)
    scatter_y = data
    ax.scatter(scatter_x, scatter_y, s=10, color='red', zorder=9999)
    ax.set_xlim(0, 2)
    ax.set_ylim(0, 50)
    ax.get_xaxis().set_visible(False)
    ax.get_yaxis().set_visible(False)
    plt.axis('off')

    buf = io.BytesIO()
    plt.savefig(buf, format='png', bbox_inches='tight', pad_inches=0)
    plt.close(fig)
    buf.seek(0)

    img_base64 = base64.b64encode(buf.getvalue()).decode('utf-8')
    return JSONResponse(content={'image': img_base64})


class PieChartRequest(BaseModel):
    numbers: int

class BoxChartRequest(BaseModel):
    numbers: int

@app.post('/chart/pie')
def post_chart_pie(request: PieChartRequest):
    if request.numbers <= 0:
        raise HTTPException(status_code=400, detail="Number of points must be greater than 0")
    return generate_chart_pie(request.numbers)


@app.post('/chart/box')
def post_chart_box(request: BoxChartRequest ):
    if request.numbers <= 0:
        raise HTTPException(status_code=400, detail="Number of points must be greater than 0")
    return generate_chart_box(request.numbers)