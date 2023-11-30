from PyQt5.QtWidgets import (
    QApplication,
    QMainWindow,
    QLabel,
    QSlider,
    QHBoxLayout,
    QVBoxLayout,
    QWidget,
)
from PyQt5.QtCore import Qt
from PyQt5.QtGui import QPixmap, QImage
import pydicom
import cv2
import numpy as np
import os
import sys


class DicomViewer(QMainWindow):
    def __init__(self, folder_path):
        super().__init__()

        self.folder_path = folder_path
        self.dicom_images = self.load_dicom_images(folder_path)
        self.current_index = 0

        self.init_ui()

    def init_ui(self):
        # Create a label to display images
        self.image_label = QLabel(self)
        self.image_label_filtered = QLabel(self)
        self.update_image(self.current_index)

        # Create a slider
        self.slider = QSlider(Qt.Horizontal, self)
        self.slider.setMinimum(0)
        self.slider.setMaximum(len(self.dicom_images) - 1)
        self.slider.valueChanged.connect(self.slider_moved)

        # Layout
        h_layout = QHBoxLayout()
        h_layout.addWidget(self.image_label)
        h_layout.addWidget(self.image_label_filtered)

        v_layout = QVBoxLayout()
        v_layout.addLayout(h_layout)
        v_layout.addWidget(self.slider)

        container = QWidget()
        container.setLayout(v_layout)
        self.setCentralWidget(container)

    def load_dicom_images(self, folder_path):
        images = []
        for filename in os.listdir(folder_path):
            if filename.endswith(".dcm"):
                filepath = os.path.join(folder_path, filename)
                dicom_data = pydicom.dcmread(filepath)
                image = dicom_data.pixel_array
                images.append(image)
                image_8bit = cv2.normalize(image, None, 0, 255, cv2.NORM_MINMAX).astype(
                    np.uint8
                )
                # cv2.imshow("DICOM Image", image_8bit)
                # cv2.waitKey(0)
                # cv2.destroyAllWindows()
        return images

    def update_image(self, index):
        image_data = self.dicom_images[index]
        # image_8bit = self.convert_to_8bit(image_data)
        image_8bit = cv2.normalize(image_data, None, 0, 255, cv2.NORM_MINMAX).astype(
            np.uint8
        )
        # cv2.imshow("DICOM Image", image_8bit)
        qimage = QImage(
            image_8bit.data,
            image_8bit.shape[1],
            image_8bit.shape[0],
            image_8bit.shape[1],
            QImage.Format_Grayscale8,
        )
        pixmap = QPixmap.fromImage(qimage)
        self.image_label.setPixmap(pixmap)
        self.image_label_filtered.setPixmap(pixmap)

    def convert_to_8bit(self, image):
        image_8bit = cv2.normalize(image, None, 0, 255, cv2.NORM_MINMAX)
        return np.uint8(image_8bit)

    def slider_moved(self, position):
        self.current_index = position
        self.update_image(position)


# To run the application
app = QApplication(sys.argv)
viewer = DicomViewer("./dicom")
viewer.show()
sys.exit(app.exec_())
