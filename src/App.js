import React from 'react'

import './App.css'

function init() {
  /**
   * Создаем мультимаршрут.
   * Первым аргументом передаем модель либо объект описания модели.
   * Вторым аргументом передаем опции отображения мультимаршрута.
   * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/multiRouter.MultiRoute.xml
   * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/multiRouter.MultiRouteModel.xml
   */
  const multiRoute = new window.ymaps.multiRouter.MultiRoute({
    // Описание опорных точек мультимаршрута.
    referencePoints: [
      [ 55.734876, 37.59308 ],
      'Москва, ул. Мясницкая'
    ],
    // Параметры маршрутизации.
    params: {
      // Ограничение на максимальное количество маршрутов, возвращаемое маршрутизатором.
      results: 2
    }
  }, {
    // Автоматически устанавливать границы карты так, чтобы маршрут был виден целиком.
    boundsAutoApply: true
  })

  // Создаем кнопки для управления мультимаршрутом.
  const trafficButton = new window.ymaps.control.Button({
    data: { content: 'Учитывать пробки' },
    options: { selectOnClick: true }
  })
  const viaPointButton = new window.ymaps.control.Button({
    data: { content: 'Добавить транзитную точку' },
    options: { selectOnClick: true }
  })

  // Объявляем обработчики для кнопок.
  trafficButton.events.add('select', function() {
    /**
     * Задаем параметры маршрутизации для модели мультимаршрута.
     * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/multiRouter.MultiRouteModel.xml#setParams
     */
    multiRoute.model.setParams({ avoidTrafficJams: true }, true)
  })

  trafficButton.events.add('deselect', function() {
    multiRoute.model.setParams({ avoidTrafficJams: false }, true)
  })

  viaPointButton.events.add('select', function() {
    const referencePoints = multiRoute.model.getReferencePoints()
    referencePoints.splice(1, 0, 'Москва, ул. Солянка, 7')
    /**
     * Добавляем транзитную точку в модель мультимаршрута.
     * Обратите внимание, что транзитные точки могут находится только
     * между двумя путевыми точками, т.е. не могут быть крайними точками маршрута.
     * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/multiRouter.MultiRouteModel.xml#setReferencePoints
     */
    multiRoute.model.setReferencePoints(referencePoints, [ 1 ])
  })

  viaPointButton.events.add('deselect', function() {
    const referencePoints = multiRoute.model.getReferencePoints()
    referencePoints.splice(1, 1)
    multiRoute.model.setReferencePoints(referencePoints, [])
  })

  // Создаем карту с добавленными на нее кнопками.
  const myMap = new window.ymaps.Map('map', {
    center: [ 55.750625, 37.626 ],
    zoom: 7,
    controls: [ trafficButton, viaPointButton ]
  }, {
    buttonMaxWidth: 300
  })

  // Добавляем мультимаршрут на карту.
  myMap.geoObjects.add(multiRoute)
}
const App = () => {
  window.ymaps.ready(init)
  return (
    <div></div>
  )
}

export default App
