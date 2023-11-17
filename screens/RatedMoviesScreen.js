import {
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  Platform,
  FlatList,
  SafeAreaView,
  Button,
  ActivityIndicator
} from 'react-native'
import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { fallbackMoviePoster, image185 } from '../api/moviesdb'
import { fetchTopRatedMovies } from '../api/moviesdb'
import Loading from '../components/loading'
import { ChevronLeftIcon } from 'react-native-heroicons/outline'
import { styles } from '../theme'

const { width, height } = Dimensions.get('window')

const ios = Platform.OS == 'ios'

const verticalMargin = ios ? '' : ' my-3'

export default function RatedMoviesScreen({ title, hideSeeAll, data }) {
  const navigation = useNavigation()

  const [topRated, setTopRated] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)

  useEffect(() => {
    getTopRatedMovies()
  }, [])

  const getTopRatedMovies = async (pageNumber) => {
    setLoading(true)
    const data = await fetchTopRatedMovies(pageNumber)

    if (data && data.results) {
      setTopRated((prevMovies) => [...prevMovies, ...data.results])
    }
    setLoading(false)
  }

  const loadMoreMovies = () => {
    setPage((prevPage) => prevPage + 1)
    getTopRatedMovies(page + 1)
  }

  return (
    <View className='flex-1 bg-neutral-800'>
      <SafeAreaView
        className={
          'flex-row justify-between items-center mx-4 z-10 ' + verticalMargin
        }
      >
        <TouchableOpacity
          style={styles.background}
          className='rounded-xl p-1'
          onPress={() => navigation.goBack()}
        >
          <ChevronLeftIcon size='28' strokeWidth={2.5} color='white' />
        </TouchableOpacity>
      </SafeAreaView>
      <View className='mx-4 flex-row justify-between items-center'>
        <Text className='text-white text-lg'>Top rated</Text>
      </View>
      {loading && topRated.length === 0 ? (
        <Loading />
      ) : (
        <FlatList
          data={topRated}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={{ paddingHorizontal: 15 }}
          ListFooterComponent={() => (
            <TouchableOpacity
              onPress={loadMoreMovies}
              className='bg-yellow-500 text-neutral-800 items-center justify-center h-12 rounded'
            >
              {loading ? (
                <ActivityIndicator size='small' className='#737373' />
              ) : (
                <Text className='text-lg text-neutral-800 font-semibold'>
                  Show More
                </Text>
              )}
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  )
}

const renderItem = ({ item }) => (
  <TouchableOpacity
    onPress={() => navigation.push('MovieDetail', item)}
    className='m-2'
  >
    <View className='space-y-1'>
      <Image
        source={{ uri: image185(item.poster_path) || fallbackMoviePoster }}
        className='rounded-3xl'
        style={{ width: width / 2 - 30, height: height * 0.22 }}
      />
      <Text className='text-neutral-300'>
        {item.title.length > 14 ? item.title.slice(0, 14) + '...' : item.title}
      </Text>
      <Text className='text-neutral-300'>{item.vote_average}</Text>
    </View>
  </TouchableOpacity>
)
